# frozen_string_literal: true

module SerialNumbers
  class Generator < Jekyll::Generator
    def generate(site)
      # Track counters per category per year
      counters = Hash.new { |h, k| h[k] = Hash.new(0) }

      # Process posts chronologically to ensure consistent numbering
      site.posts.docs.sort_by(&:date).each do |post|
        year = post.date.year
        category = determine_category(post)
        series_code = generate_series_code(category)

        counters[year][series_code] += 1
        counter = counters[year][series_code]

        # Format serial number as YYYY.SSS.###
        serial_number = format('%04d.%s.%03d', year, series_code, counter)
        post.data['serial_number'] = serial_number
      end

      site.pages.each do |page|
        # Skip special pages and assets
        next if page.url.include?('assets')
        next if page.url.include?('.json')
        next if page.url.include?('.xml')
        next if page.url == '/404.html'
        next if page.data['layout'].nil?

        # Use current year for pages without dates
        year = page.data['date'] ? Date.parse(page.data['date'].to_s).year : Date.today.year
        series_code = 'PAE'

        counters[year][series_code] += 1
        counter = counters[year][series_code]

        serial_number = format('%04d.%s.%03d', year, series_code, counter)
        page.data['serial_number'] = serial_number
      end
    end

    private

    def determine_category(post)
      if post.data['category']
        post.data['category']
      elsif post.data['categories'] && !post.data['categories'].empty?
        post.data['categories'].first
      elsif post.data['layout']
        post.data['layout'].downcase
      else
        'post'
      end
    end

    def generate_series_code(category)
      # Generate a 3-letter code from the category name
      cleaned = category.to_s.downcase.gsub(/[^a-z]/, '')

      if cleaned.length >= 3
        # Take first letter, middle letter, and last letter for longer words
        if cleaned.length == 3
          cleaned.upcase
        else
          middle_index = cleaned.length / 2 - (cleaned.length.even? ? 1 : 0)
          (cleaned[0] + cleaned[middle_index] + cleaned[-1]).upcase
        end
      elsif cleaned.length == 2
        # For 2-letter categories, add the first letter again
        (cleaned + cleaned[0]).upcase
      elsif cleaned.length == 1
        # For 1-letter categories, repeat 3 times
        (cleaned * 3).upcase
      else
        # Default fallback
        'PST'
      end
    end
  end
end
