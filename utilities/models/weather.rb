# frozen_string_literal: true

require 'net/http'
require 'json'

module Models
  class Weather
    class Error < StandardError; end

    def self.fetch_conditions(lat, lng, datetime)
      date = datetime.strftime('%Y-%m-%d')
      hour = datetime.hour

      # Check if date is within last 5 days (use forecast API) or older (use archive API)
      days_ago = (Time.now.to_date - datetime.to_date).to_i

      if days_ago <= 5
        # Use forecast API with past_days for recent dates
        uri = URI.parse("https://api.open-meteo.com/v1/forecast?latitude=#{lat}&longitude=#{lng}&hourly=temperature_2m,apparent_temperature,precipitation,rain,weathercode,windspeed_10m,winddirection_10m,relativehumidity_2m&timezone=auto&past_days=#{[
          days_ago + 1, 92
        ].min}&forecast_days=1")
      else
        # Use archive API for older dates
        uri = URI.parse("https://archive-api.open-meteo.com/v1/archive?latitude=#{lat}&longitude=#{lng}&start_date=#{date}&end_date=#{date}&hourly=temperature_2m,apparent_temperature,precipitation,rain,weathercode,windspeed_10m,winddirection_10m,relativehumidity_2m&timezone=auto")
      end

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

      # Find the correct hour index for the target date
      if days_ago <= 5
        # For forecast API, we need to find the right time in the array
        times = hourly_data['time']
        target_time = datetime.strftime('%Y-%m-%dT%H:00')
        hour_index = times.index(target_time)

        if hour_index.nil?
          puts "Could not find hour #{target_time} in weather data"
          return nil
        end
      else
        # For archive API, hour is the direct index
        hour_index = hour
      end

      # Check if we have valid data
      temp_value = hourly_data['temperature_2m'][hour_index]
      if temp_value.nil?
        puts "No weather data available for #{datetime} (got nil values)"
        return nil
      end

      {
        temperature: "#{temp_value}°C",
        apparent_temperature: "#{hourly_data['apparent_temperature'][hour_index]}°C",
        precipitation: "#{hourly_data['precipitation'][hour_index]}mm",
        rain: "#{hourly_data['rain'][hour_index]}mm",
        humidity: "#{hourly_data['relativehumidity_2m'][hour_index]}%",
        weathercode: weather_description(hourly_data['weathercode'][hour_index]),
        windspeed: "#{hourly_data['windspeed_10m'][hour_index]}km/h",
        winddirection: "#{hourly_data['winddirection_10m'][hour_index]}°"
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
