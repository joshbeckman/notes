# frozen_string_literal: true

require 'json'
require 'net/http'

module Bluesky
  # Authentication against the Bluesky API
  module Auth
    class Error < StandardError; end

    def generate_did(handle)
      uri = URI.parse('https://bsky.social/xrpc/com.atproto.identity.resolveHandle')
      params = { handle: handle }
      uri.query = URI.encode_www_form(params)
      response = Net::HTTP.get_response(uri)
      unless response.is_a?(Net::HTTPSuccess)
        puts response.body
        raise Error, 'DID identification failed'
      end

      JSON.parse(response.body)['did']
    end

    def resolve_handle(did)
      uri = URI.parse("https://plc.directory/#{did}")
      response = Net::HTTP.get_response(uri)
      unless response.is_a?(Net::HTTPSuccess)
        return nil if response.code == '404'

        puts response.body
        raise Error, 'Handle resolution failed'
      end

      at_handle = JSON.parse(response.body)['alsoKnownAs'].first
      "@#{at_handle.split('at://').last}"
    end

    def resolve_did_to_profile(did)
      "https://bsky.app/profile/#{did}"
    end

    def extract_did(uri)
      match = uri.match(%r{did:plc:[^/]*})
      return nil if match.nil?

      match[0]
    end

    # at://<DID>/<COLLECTION>/<RKEY> resolves to https://bsky.app/profile/<DID>/post/<RKEY>
    # example URI:
    # at://did:plc:pko7wbcggok753hnvndxh3ni/app.bsky.feed.post/3ld75432fq42c
    def resolve_post_uri(uri)
      did = extract_did(uri)
      rkey = uri.split('/').last
      return nil if did.nil? || rkey.nil?

      pretty_did = resolve_handle(did)
      did = pretty_did.split('@').last unless pretty_did.nil?
      "https://bsky.app/profile/#{did}/post/#{rkey}"
    end

    def generate_api_key(did, password)
      uri = URI.parse('https://bsky.social/xrpc/com.atproto.server.createSession')
      request = Net::HTTP::Post.new(uri)
      request.content_type = 'application/json'
      request.body = JSON.dump({
                                 'identifier' => did,
                                 'password' => password
                               })
      req_options = {
        use_ssl: uri.scheme == 'https'
      }
      response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
        http.request(request)
      end
      unless response.is_a?(Net::HTTPSuccess)
        puts response.body
        raise Error, 'API Key generation failed'
      end

      JSON.parse(response.body)['accessJwt']
    end
  end
end
