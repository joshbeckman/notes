# frozen_string_literal: true

require 'digest'

Sequence = Struct.new(
  :id,
  :posts,
  keyword_init: true
) do
  def self.create(posts)
    urls = posts.map(&:url).sort.join('|')
    new(
      id: Digest::MD5.hexdigest(urls),
      posts: posts
    )
  end

  def tags
    posts.flat_map { |post| post.data['tags'] || [] }.uniq.sort
  end

  def topic
    tag_counts = posts.flat_map { |post| post.data['tags'] || [] }
                      .each_with_object(Hash.new(0)) { |tag, counts| counts[tag] += 1 }
    tag_counts.max_by { |_tag, count| count }&.first
  end

  def start_date
    dates = posts.map { |post| post.data['date'] }.compact
    dates.min
  end

  def end_date
    dates = posts.map { |post| post.data['date'] }.compact
    dates.max
  end

  def to_liquid
    to_h
  end

  def to_h
    {
      'id' => id,
      'posts' => posts.map do |post|
        {
          'url' => post.url,
          'title' => post.data['title'] || post.name,
        }
      end,
      'tags' => tags,
      'topic' => topic,
      'start_date' => start_date&.iso8601,
      'end_date' => end_date&.iso8601
    }
  end
end
