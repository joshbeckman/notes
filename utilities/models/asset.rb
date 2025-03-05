# frozen_string_literal: true

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
    # determine the filetype
    # rename the file to the path with the correct extension
    filetype = `file --mime-type -b #{path}`.strip.split('/').last
    # append the filetype to the path if it is not already there
    new_path = if path.split('.').last == filetype
                 path
               else
                 "#{path}.#{filetype}"
               end
    puts "Renaming #{path} to #{new_path}"
    `mv #{path} #{new_path}`
    self.path = new_path
  end

  def insert_into_content(content)
    return content if path.nil?

    if image?
      content.gsub(url, public_path)
    else
      content.gsub(url, standalone_md)
    end
  end
end
