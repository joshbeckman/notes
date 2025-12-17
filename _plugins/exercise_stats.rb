# frozen_string_literal: true

module Jekyll
  module ExerciseStatsFilter
    # Parse time string like "44m49s", "1h11m1s", "22m45s" into seconds
    def parse_time_to_seconds(input)
      return 0 if input.nil? || input.to_s.strip.empty?

      str = input.to_s
      hours = str.match(/(\d+)h/)&.captures&.first.to_i
      minutes = str.match(/(\d+)m/)&.captures&.first.to_i
      seconds = str.match(/(\d+)s/)&.captures&.first.to_i

      (hours * 3600) + (minutes * 60) + seconds
    end

    # Parse distance string like "2.22mi" into float miles
    def parse_miles(input)
      return 0.0 if input.nil? || input.to_s.strip.empty?

      input.to_s.gsub(/[^\d.]/, '').to_f
    end

    # Format seconds into human-readable time like "1h 23m"
    def format_duration(seconds)
      return '0min' if seconds.nil? || seconds.to_i.zero?

      total_seconds = seconds.to_i
      hours = total_seconds / 3600
      minutes = (total_seconds % 3600) / 60

      if hours.positive?
        "#{hours}hr #{minutes}min"
      else
        "#{minutes}min"
      end
    end

    # Sum elapsed_time from an array of exercise posts
    # Uses numeric field if available, falls back to parsing formatted string
    def sum_exercise_time(posts)
      posts.sum do |post|
        numeric_time = post.data.dig('exercise_data', 'elapsed_time_seconds') ||
                       post.data.dig('exercise_data', 'moving_time_seconds')
        if numeric_time && numeric_time.to_i.positive?
          numeric_time.to_i
        else
          time_str = post.data.dig('exercise_data', 'elapsed_time_in_hours_s') ||
                     post.data.dig('exercise_data', 'moving_time_in_hours_s')
          parse_time_to_seconds(time_str)
        end
      end
    end

    # Sum distance from an array of exercise posts
    # Uses numeric field if available, falls back to parsing formatted string
    def sum_miles(posts)
      posts.sum do |post|
        numeric_miles = post.data.dig('exercise_data', 'distance_miles')
        if numeric_miles && numeric_miles.to_f.positive?
          numeric_miles.to_f
        else
          miles_str = post.data.dig('exercise_data', 'distance_in_miles')
          parse_miles(miles_str)
        end
      end
    end

    # Count unique active days from an array of posts
    def count_active_days(posts)
      posts.map { |post| post.date.to_date }.uniq.size
    end

    # Format miles with one decimal place
    def format_miles(miles)
      return '0mi' if miles.nil? || miles.to_f.zero?

      format('%.1fmi', miles.to_f)
    end
  end
end

Liquid::Template.register_filter(Jekyll::ExerciseStatsFilter)
