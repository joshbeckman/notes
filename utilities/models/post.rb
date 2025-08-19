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
  :strava_activity_url,
  :exercise_data,
  :letterboxd_review_url,
  :hacker_news_url,
  :rating,
  :song_link,
  :photo_feature,
  :slug,
  :tags,
  :title,
  :layout,
  :youtube_video_id,
  :youtube_video_url,
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

  def filename
    "#{category}/_posts/#{date.strftime('%Y-%m-%d')}-#{slug}.md"
  end

  def front_matter
    hash = {
      'layout' => layout || 'Post',
      'date' => date.strftime('%Y-%m-%d %H:%M:%S %z'),
      'title' => title,
      'toc' => true,
      'image' => image,
      'description' => description,
    }
    hash['hide_title'] = true if hide_title
    hash['canonical'] = canonical if canonical
    hash['rating'] = rating if rating
    hash['imdb_id'] = imdb_id if imdb_id
    hash['tmdb_id'] = tmdb_id if tmdb_id
    hash['song_link'] = song_link if song_link
    hash['letterboxd_id'] = letterboxd_id if letterboxd_id
    hash['in_reply_to'] = in_reply_to if in_reply_to
    hash['photo_feature'] = bool_or_string(photo_feature) unless photo_feature.nil?
    hash['mastodon_social_status_url'] = bool_or_string(mastodon_social_status_url) unless mastodon_social_status_url.nil?
    hash['bluesky_status_url'] = bool_or_string(bluesky_status_url) unless bluesky_status_url.nil?
    hash['strava_activity_url'] = strava_activity_url unless strava_activity_url.nil?
    hash['letterboxd_review_url'] = letterboxd_review_url unless letterboxd_review_url.nil?
    hash['hacker_news_url'] = hacker_news_url unless hacker_news_url.nil?
    hash['youtube_video_id'] = youtube_video_id unless youtube_video_id.nil?
    hash['youtube_video_url'] = youtube_video_url unless youtube_video_url.nil?
    hash['exercise_data'] = exercise_data.transform_keys(&:to_s) if exercise_data
    hash['tags'] = tags if tags&.any?
    hash
  end

  def bool_or_string(value)
    if value == 'true' || value == 'false'
      value == 'true'
    else
      value
    end
  end

  def file_exists?
    File.exist?(filename)
  end

  def create_file
    File.open(filename, 'w') do |file|
      file.puts front_matter.to_yaml
      file.puts '---'
      file.puts ''
      file.puts body
    end
    filename
  end
end
