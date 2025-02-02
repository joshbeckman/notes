# frozen_string_literal: true

require 'json'
require 'net/http'
require 'uri'

Post = Struct.new(
  :body,
  :category,
  :canonical,
  :description,
  :image,
  :date,
  :imdb_id,
  :tmdb_id,
  :letterboxd_id,
  :in_reply_to,
  :hide_title,
  :mastodon_social_status_url,
  :bluesky_status_url,
  :letterboxd_review_url,
  :rating,
  :song_link,
  :slug,
  :tags,
  :title,
  keyword_init: true
) do
  def movie_cover_image
    key = ENV.fetch('OMDB_TOKEN', nil)
    unless key
      puts 'OMDB_TOKEN environment variable not set'
      return
    end
    url = "https://www.omdbapi.com/?i=#{imdb_id}&apikey=#{key}"
    uri = URI(url)
    response = Net::HTTP.get(uri)
    json = JSON.parse(response)
    json['Poster']
  end

  def suggested_title
    request = Net::HTTP::Post.new(URI.parse('https://joshbeckman-titler.web.val.run'))
    request.content_type = 'application/x-www-form-urlencoded'
    content = "#{title}\n#{body}"
    request.set_form_data('content' => content)
    response = Net::HTTP.start(request.uri.hostname, request.uri.port, use_ssl: request.uri.scheme == 'https') do |http|
      http.request(request)
    end
    JSON.parse(response.body)['suggestedTitle']
  rescue Net::HTTPError, JSON::ParserError
    nil
  end

  def suggested_tags
    request = Net::HTTP::Post.new(URI.parse('https://joshbeckman-tagger.web.val.run'))
    request.content_type = 'application/x-www-form-urlencoded'
    content = "#{title}\n#{body}"
    request.set_form_data('content' => content)
    response = Net::HTTP.start(request.uri.hostname, request.uri.port, use_ssl: request.uri.scheme == 'https') do |http|
      http.request(request)
    end
    JSON.parse(response.body)['suggestedTags']
  rescue Net::HTTPError, JSON::ParserError
    nil
  end

  def create_file
    filename = "#{category}/_posts/#{date.strftime('%Y-%m-%d')}-#{slug}.md"

    File.open(filename, 'w') do |file|
      file.puts '---'
      file.puts 'layout: Post'
      file.puts "date: #{date.strftime('%Y-%m-%d %H:%M:%S %z')}"
      file.puts "title: \"#{title}\""
      file.puts 'toc: true'
      file.puts 'hide_title: true' if hide_title
      file.puts "canonical: #{canonical}" if canonical
      file.puts "rating: #{rating}" if rating
      file.puts "imdb_id: #{imdb_id}" if imdb_id
      file.puts "tmdb_id: #{tmdb_id}" if tmdb_id
      file.puts "song_link: #{song_link}" if song_link
      file.puts "letterboxd_id: #{letterboxd_id}" if letterboxd_id
      file.puts "image: #{image}"
      file.puts "description: #{description}"
      file.puts "in_reply_to: #{in_reply_to}" if in_reply_to
      file.puts "mastodon_social_status_url: #{mastodon_social_status_url}" unless mastodon_social_status_url.nil?
      file.puts "bluesky_status_url: #{bluesky_status_url}" unless bluesky_status_url.nil?
      file.puts "letterboxd_review_url: #{letterboxd_review_url}" unless letterboxd_review_url.nil?
      if tags&.any?
        file.puts 'tags:'
        tags.each do |tag|
          file.puts "  - #{tag}"
        end
      end
      file.puts '---'
      file.puts ''
      file.puts body
    end
    filename
  end
end
