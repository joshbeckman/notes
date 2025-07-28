# frozen_string_literal: true

require 'net/http'
require 'json'

module Models
  class Weather
    class Error < StandardError; end

    def self.fetch_conditions(lat, lng, datetime)
      date = datetime.strftime('%Y-%m-%d')
      hour = datetime.hour
      
      uri = URI.parse("https://archive-api.open-meteo.com/v1/archive?latitude=#{lat}&longitude=#{lng}&start_date=#{date}&end_date=#{date}&hourly=temperature_2m,apparent_temperature,precipitation,rain,weathercode,windspeed_10m,winddirection_10m,relativehumidity_2m&timezone=auto")
      request = Net::HTTP::Get.new(uri)
      req_options = {
        use_ssl: uri.scheme == 'https'
      }
      
      res = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
        http.request(request)
      end

      unless res.is_a?(Net::HTTPSuccess)
        puts "Weather fetch failed: #{res.body}"
        return nil
      end

      resp_body = JSON.parse(res.body)
      hourly_data = resp_body['hourly']
      
      {
        temperature: "#{hourly_data['temperature_2m'][hour]}°C",
        apparent_temperature: "#{hourly_data['apparent_temperature'][hour]}°C",
        precipitation: "#{hourly_data['precipitation'][hour]}mm",
        rain: "#{hourly_data['rain'][hour]}mm",
        humidity: "#{hourly_data['relativehumidity_2m'][hour]}%",
        weathercode: weather_description(hourly_data['weathercode'][hour]),
        windspeed: "#{hourly_data['windspeed_10m'][hour]}km/h",
        winddirection: "#{hourly_data['winddirection_10m'][hour]}°"
      }
    rescue StandardError => e
      puts "Error fetching weather: #{e.message}"
      nil
    end

    def self.weather_description(code)
      # WMO Weather interpretation codes
      # https://open-meteo.com/en/docs
      case code
      when 0 then 'Clear sky'
      when 1 then 'Mainly clear'
      when 2 then 'Partly cloudy'
      when 3 then 'Overcast'
      when 45 then 'Fog'
      when 48 then 'Depositing rime fog'
      when 51 then 'Light drizzle'
      when 53 then 'Moderate drizzle'
      when 55 then 'Dense drizzle'
      when 56 then 'Light freezing drizzle'
      when 57 then 'Dense freezing drizzle'
      when 61 then 'Slight rain'
      when 63 then 'Moderate rain'
      when 65 then 'Heavy rain'
      when 66 then 'Light freezing rain'
      when 67 then 'Heavy freezing rain'
      when 71 then 'Slight snow fall'
      when 73 then 'Moderate snow fall'
      when 75 then 'Heavy snow fall'
      when 77 then 'Snow grains'
      when 80 then 'Slight rain showers'
      when 81 then 'Moderate rain showers'
      when 82 then 'Violent rain showers'
      when 85 then 'Slight snow showers'
      when 86 then 'Heavy snow showers'
      when 95 then 'Thunderstorm'
      when 96 then 'Thunderstorm with slight hail'
      when 99 then 'Thunderstorm with heavy hail'
      else "Unknown (#{code})"
      end
    end
  end
end