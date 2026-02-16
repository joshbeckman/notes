# frozen_string_literal: true

module Jekyll
  class IcalFeed < Generator
    safe true
    priority :lowest

    def generate(site)
      if site.config.dig("feed", "disable_in_development") && site.config["env"] == "development"
        Jekyll.logger.info "iCal Feed:", "Skipping feed generation in development environment"
        return
      else
        Jekyll.logger.info "iCal Feed:", "Generating iCal feed for posts"
      end

      categories = site.config.dig("feed", "categories") || []
      base_url = site.config["url"] || ""

      all_posts = site.posts.docs
                      .sort_by(&:date)
                      .reverse

      site.pages << ical_page(site, "feed.ics", all_posts, site.config["title"], base_url)

      categories.each do |cat|
        cat_posts = site.posts.docs
                        .select { |p| p.data["categories"]&.include?(cat) }
                        .sort_by(&:date)
                        .reverse
        site.pages << ical_page(site, "feed/#{cat}.ics", cat_posts, "#{site.config["title"]} - #{cat.capitalize}", base_url)
      end
    end

    private

    def ical_page(site, path, posts, cal_name, base_url)
      dir = File.dirname(path)
      name = File.basename(path)
      page = PageWithoutAFile.new(site, site.source, dir == "." ? "" : dir, name)
      page.content = render_ical(posts, cal_name, base_url)
      page.data["layout"] = nil
      page.data["sitemap"] = false
      page
    end

    def render_ical(posts, cal_name, base_url)
      lines = []
      lines << "BEGIN:VCALENDAR"
      lines << "VERSION:2.0"
      lines << "PRODID:-//joshbeckman.org//NONSGML Jekyll iCal//EN"
      lines << "X-WR-CALNAME:#{ical_escape(cal_name)}"
      lines << "METHOD:PUBLISH"
      lines << "REFRESH-INTERVAL;VALUE=DURATION:P1D"
      lines << "X-PUBLISHED-TTL:P1D"

      now = Time.now.utc.strftime("%Y%m%dT%H%M%SZ")

      posts.each do |post|
        lines << "BEGIN:VEVENT"
        lines << "UID:#{ical_escape(post.id)}@joshbeckman.org"
        lines << "DTSTAMP:#{now}"
        lines << "DTSTART:#{post.date.utc.strftime("%Y%m%dT%H%M%SZ")}"
        lines << "DTEND:#{(post.date + 3600).utc.strftime("%Y%m%dT%H%M%SZ")}"
        lines << "SUMMARY:#{ical_escape(post.data["title"] || "Untitled")}"

        desc = build_description(post)
        lines << "DESCRIPTION:#{ical_escape(desc)}" unless desc.empty?

        url = "#{base_url}#{post.url}"
        lines << "URL:#{url}"

        tags = post.data["tags"]
        if tags.is_a?(Array) && !tags.empty?
          lines << "CATEGORIES:#{tags.map { |t| ical_escape(t) }.join(",")}"
        end

        img = post.data["image"]
        if img && !img.to_s.strip.empty?
          img_url = img.start_with?("/") ? "#{base_url}#{img}" : img
          lines << "IMAGE;VALUE=URI:#{img_url}"
        end

        latlng = post.data.dig("exercise_data", "start_latlng")
        if latlng.is_a?(Array) && latlng.length == 2 && latlng.all? { |v| v.is_a?(Numeric) }
          lines << "GEO:#{latlng[0]};#{latlng[1]}"
        end

        lines << "TRANSP:TRANSPARENT"
        lines << "END:VEVENT"
      end

      lines << "END:VCALENDAR"
      fold_lines(lines).join("\r\n") + "\r\n"
    end

    def build_description(post)
      desc = (post.data["description"] || "").to_s.strip
      if desc.empty? && post.data["excerpt"]
        desc = post.data["excerpt"].to_s.gsub(/<[^>]+>/, "").strip.slice(0, 200) || ""
      end
      ex = post.data["exercise_data"]
      return desc unless ex.is_a?(Hash)

      parts = []
      dist = ex["distance_in_miles"] || (ex["distance_miles"]&.to_f&.positive? ? "#{ex["distance_miles"]}mi" : nil)
      parts << dist if dist && !dist.to_s.strip.empty?

      time = ex["elapsed_time_in_hours_s"] || ex["moving_time_in_hours_s"]
      parts << time if time && !time.to_s.strip.empty?

      hr = ex["average_heartrate"]
      parts << "avg HR #{hr}" if hr && !hr.to_s.strip.empty?

      return desc if parts.empty?

      [desc, parts.join(" / ")].reject(&:empty?).join(" - ")
    end

    def ical_escape(str)
      str.to_s
         .gsub("\\", "\\\\")
         .gsub(";", "\\;")
         .gsub(",", "\\,")
         .gsub("\r\n", "\\n")
         .gsub("\n", "\\n")
         .gsub("\r", "\\n")
    end

    # RFC 5545: lines longer than 75 octets must be folded with CRLF + space
    def fold_lines(lines)
      lines.flat_map do |line|
        bytes = line.encode("UTF-8").bytes
        next [line] if bytes.length <= 75

        folded = []
        buf = []
        bytes.each do |b|
          limit = folded.empty? ? 75 : 74
          if buf.length >= limit
            folded << buf.pack("C*").force_encoding("UTF-8")
            buf = [b]
          else
            buf << b
          end
        end
        folded << buf.pack("C*").force_encoding("UTF-8") unless buf.empty?
        first = folded.shift
        [first] + folded.map { |f| " #{f}" }
      end
    end
  end
end
