# frozen_string_literal: true

require 'net/http'
require 'uri'

Asset = Struct.new(:url, :category, :path, :alt, keyword_init: true) do
  def image?
    category == 'images'
  end

  def video?
    category == 'videos'
  end

  def public_path
    "/#{path}"
  end

  def standalone_md
    if image?
      "![#{alt || 'image'}](#{public_path})"
    else
      "<video controls src=\"#{public_path}\"></video>"
    end
  end

  # checks if there is a file at the path
  # exits if there is
  # downloads the image from the url to the path
  def download
    return if !path.nil? && File.exist?(path)

    path = "assets/#{category}/#{url.split('/').last}" if path.nil?

    puts "Downloading #{url} to #{path}"
    `curl -L -o #{path} "#{url}"`

    if path.end_with?('.m3u8') || `file --mime-type -b #{path}`.strip == 'application/vnd.apple.mpegurl'
      puts 'Detected m3u8 file, parsing for largest video segment...'
      actual_video_result = find_largest_video_from_m3u8(path)
      if actual_video_result
        `rm #{path}`
        new_path = path.gsub(/\.m3u8$/, '.mp4')
        if actual_video_result.start_with?('/tmp/')
          puts "Moving concatenated video to #{new_path}"
          `mv #{actual_video_result} #{new_path}`
        else
          puts "Downloading actual video from #{actual_video_result} to #{new_path}"
          `curl -L -o #{new_path} "#{actual_video_result}"`
        end
        self.path = new_path
      else
        puts 'Could not find video segments in m3u8 file'
        self.path = path
      end
    else
      filetype = `file --mime-type -b #{path}`.strip.split('/').last
      new_path = if path.split('.').last == filetype
                   path
                 else
                   "#{path}.#{filetype}"
                 end
      puts "Renaming #{path} to #{new_path}"
      `mv #{path} #{new_path}`
      self.path = new_path
    end
  end

  def insert_into_content(content)
    return content if path.nil?

    if image?
      content.gsub(url, public_path)
    else
      content.gsub(url, standalone_md)
    end
  end

  private

  def find_largest_video_from_m3u8(m3u8_path)
    content = File.read(m3u8_path)
    base_url = File.dirname(url)
    segments = []
    if content.include?('#EXT-X-STREAM-INF')
      variants = content.scan(/#EXT-X-STREAM-INF:.*BANDWIDTH=(\d+).*\n(.+)/)
      if variants.any?
        # Sort by bandwidth and get the highest
        highest_variant = variants.max_by { |bandwidth, _| bandwidth.to_i }
        variant_url = highest_variant[1]

        variant_url = "#{base_url}/#{variant_url}" unless variant_url.start_with?('http')

        puts "Fetching variant playlist: #{variant_url}"
        variant_content = `curl -sL "#{variant_url}"`
        variant_base = File.dirname(variant_url)
        variant_content.lines.each do |line|
          line = line.strip
          next if line.empty? || line.start_with?('#')

          segment_url = line.start_with?('http') ? line : "#{variant_base}/#{line}"
          segments << segment_url
        end
      end
    else
      # Direct segment playlist
      content.lines.each do |line|
        line = line.strip
        next if line.empty? || line.start_with?('#')

        segment_url = line.start_with?('http') ? line : "#{base_url}/#{line}"
        segments << segment_url
      end
    end

    return nil if segments.empty?

    if segments.length == 1
      segments.first
    else
      puts "Found #{segments.length} segments, downloading and concatenating..."

      temp_dir = "/tmp/m3u8_segments_#{Time.now.to_i}"
      `mkdir -p #{temp_dir}`

      segment_files = []
      segments.each_with_index do |segment_url, index|
        segment_file = "#{temp_dir}/segment_#{index.to_s.rjust(5, '0')}.ts"
        puts "Downloading segment #{index + 1}/#{segments.length}..."
        `curl -sL -o #{segment_file} "#{segment_url}"`
        segment_files << segment_file
      end

      concat_file = "#{temp_dir}/concat.txt"
      File.open(concat_file, 'w') do |f|
        segment_files.each do |segment_file|
          f.puts "file '#{segment_file}'"
        end
      end

      output_file = "#{temp_dir}/output.mp4"
      puts 'Concatenating segments with ffmpeg...'
      # Use proper transcoding instead of -c copy to ensure valid MP4 output
      ffmpeg_cmd = "ffmpeg -f concat -safe 0 -i #{concat_file} -c:v libx264 -c:a aac -movflags +faststart #{output_file} -y -loglevel error"
      result = `#{ffmpeg_cmd} 2>&1`

      if $?.success? && File.exist?(output_file)
        `rm -rf #{temp_dir}/segment_*.ts #{concat_file}`
        output_file
      else
        puts "ffmpeg concatenation failed: #{result}"
        `rm -rf #{temp_dir}`
        segments.first
      end
    end
  end
end
