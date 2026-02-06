# frozen_string_literal: true

require 'net/http'

module Pushover
  def pushover(message, url = nil)
    token = ENV.fetch('PUSHOVER_API_KEY', nil)
    user = ENV.fetch('PUSHOVER_USER_KEY', nil)
    return if token.nil? || user.nil?

    uri = URI.parse('https://api.pushover.net/1/messages.json')
    req = Net::HTTP::Post.new(uri)
    body = { token: token, user: user, message: message }
    body[:url] = url if url
    req.set_form_data(body)
    Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(req) }
  end
end
