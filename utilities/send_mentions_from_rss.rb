require 'net/http'
require 'webmention'
require 'uri'
require 'nokogiri'

class SendMentionsFromRss
  Config = Struct.new(
    'MentionsFromRssConfig',
    :feed_url,
    :item_selector,
    :item_href_proc,
    :excluded_url_matcher,
    :verbose,
    keyword_init: true
  )

  def self.execute(config)
    raise ArgumentError, 'Must use a Config' unless config.is_a?(Config)

    puts "Loading RSS feed from #{config.feed_url}"
    export_uri = URI.parse(config.feed_url)
    export_req = Net::HTTP::Get.new(export_uri)
    export_res = Net::HTTP.start(export_uri.hostname, export_uri.port, use_ssl: true) do |http|
      http.request(export_req)
    end
    raise StandardError, 'Feed request failed' unless export_res.is_a?(Net::HTTPSuccess)

    doc = Nokogiri::XML(export_res.body)
    doc.css(config.item_selector).each do |link|
      href = config.item_href_proc.call(link)
      Webmention.mentioned_urls(href).each do |url|
        if url.match?(config.excluded_url_matcher)
          puts "skipping #{url}" if config.verbose
          next
        end

        result = Webmention.send_webmention(href, url)
        if result.ok?
          puts "Sent mention of #{url} by #{href}"
        else
          puts result.message
        end
      end
    end
  end
end
