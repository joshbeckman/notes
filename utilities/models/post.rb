
require 'json'
require 'net/http'
require 'uri'

Post = Struct.new(
  :body,
  :category,
  :image,
  :date,
  :imdb_id,
  :rating,
  :slug,
  :tags,
  :title,
  keyword_init: true
) do

  def movie_cover_image
    key = ENV["OMDB_TOKEN"]
    unless key
      puts "OMDB_TOKEN environment variable not set"
      return
    end
    url = "https://www.omdbapi.com/?i=#{imdb_id}&apikey=#{key}"
    uri = URI(url)
    response = Net::HTTP.get(uri)
    json = JSON.parse(response)
    json["Poster"]
  end

  def create_file
    filename = "#{category}/_posts/#{date.strftime("%Y-%m-%d")}-#{slug}.md"

    File.open(filename, 'w') do |file|
      file.puts "---"
      file.puts "layout: Post"
      file.puts "date: #{date.strftime("%Y-%m-%d %H:%M:%S %z")}"
      file.puts "title: \"#{title}\""
      file.puts "toc: true"
      if rating
        file.puts "rating: #{rating}"
      end
      if imdb_id
        file.puts "imdb_id: #{imdb_id}"
      end
      file.puts "image: #{image}"
      file.puts "description: "
      file.puts "tags: "
      tags.each do |tag|
        file.puts "  - #{tag}"
      end
      file.puts "---"
      file.puts ""
      file.puts body
    end
    filename
  end
end
