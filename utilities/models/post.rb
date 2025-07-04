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

  def create_file
    filename = "#{category}/_posts/#{date.strftime('%Y-%m-%d')}-#{slug}.md"

    front_matter = {
      'layout' => layout || 'Post',
      'date' => date.strftime('%Y-%m-%d %H:%M:%S %z'),
      'title' => title,
      'toc' => true,
      'image' => image,
      'description' => description,
    }
    front_matter['hide_title'] = true if hide_title
    front_matter['canonical'] = canonical if canonical
    front_matter['rating'] = rating if rating
    front_matter['imdb_id'] = imdb_id if imdb_id
    front_matter['tmdb_id'] = tmdb_id if tmdb_id
    front_matter['song_link'] = song_link if song_link
    front_matter['letterboxd_id'] = letterboxd_id if letterboxd_id
    front_matter['in_reply_to'] = in_reply_to if in_reply_to
    front_matter['mastodon_social_status_url'] = mastodon_social_status_url unless mastodon_social_status_url.nil?
    front_matter['bluesky_status_url'] = bluesky_status_url unless bluesky_status_url.nil?
    front_matter['strava_activity_url'] = strava_activity_url unless strava_activity_url.nil?
    front_matter['letterboxd_review_url'] = letterboxd_review_url unless letterboxd_review_url.nil?
    front_matter['hacker_news_url'] = hacker_news_url unless hacker_news_url.nil?
    front_matter['youtube_video_id'] = youtube_video_id unless youtube_video_id.nil?
    front_matter['youtube_video_url'] = youtube_video_url unless youtube_video_url.nil?
    front_matter['exercise_data'] = exercise_data.transform_keys(&:to_s) if exercise_data
    front_matter['tags'] = tags if tags&.any?
    File.open(filename, 'w') do |file|
      file.puts front_matter.to_yaml
      file.puts '---'
      file.puts ''
      file.puts body
    end
    filename
  end
end
