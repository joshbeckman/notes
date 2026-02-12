# frozen_string_literal: true

require 'net/http'

module Pushover
  def pushover(message, url = nil)
    token = ENV.fetch('PUSHOVER_API_KEY', nil)
    user = ENV.fetch('PUSHOVER_USER_KEY', nil)
    if token.nil? || user.nil?
      warn "Pushover: skipping notification (missing #{token.nil? ? 'PUSHOVER_API_KEY' : 'PUSHOVER_USER_KEY'})"
      return
    end

    uri = URI.parse('https://api.pushover.net/1/messages.json')
    req = Net::HTTP::Post.new(uri)
    body = { token: token, user: user, message: message }
    body[:url] = url if url
    req.set_form_data(body)
    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(req) }
    warn "Pushover: notification failed (#{res.code}: #{res.body})" unless res.is_a?(Net::HTTPSuccess)
    res
  end
end
