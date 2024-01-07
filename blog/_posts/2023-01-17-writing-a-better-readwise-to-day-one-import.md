---
toc: true
title: Writing a Better Readwise to Day One Importer
cover_image_url: "/assets/images/Screenshot-2023-01-16-at-7.31.03-PM.png"
custom_excerpt: Contributing to open-source on the first public holiday of the year.
date: '2023-01-17 01:31:46'
tags:
- ruby
- code
- media-log
redirect_from:
- "/writing-a-better-readwise-to-day-one-import"
- "/writing-a-better-readwise-to-day-one-import/"
---

<figure class="kg-card kg-image-card"><img src="/assets/images/Screenshot-2023-01-16-at-7.31.03-PM.png" /></figure>

I had the day off from work today in honor of Martin Luther King Jr. and the work of others like him to improve us.

Building off [the import script I wrote yesterday]( /importing-readwise-into-day-one/), I sat down this morning to more accurately pull [Readwise](https://readwise.io/) highlights into my [Day One](https://dayoneapp.com/) [media log]( /tag/media-log/) journal. &nbsp;I wanted to have actual importing of images and timestamps associated to _when_ I was reading things (rather than when I imported them).

So, I wrote a Ruby script to interact with [the Readwise API](https://readwise.io/api_deets). The script grew in complexity, but it delivered nicely after a couple hours. It pulled recent highlights, organized by book, downloaded cover images for each, and imported each as a correctly timestamped entry, with formatting I liked a bit better than before.

Then, I thought about the holiday and the communities I should support and foster. There happened to be no Readwise Ruby gem for interacting with their API.

I haven’t published a gem in a while, so I set about extracting my scripted logic into actual classes and something that would be generally useful to the public.

All that is now available as the [v0.1.0 release of the Readwise Ruby gem](https://rubygems.org/gems/readwise) as of this afternoon. It's not much, but it will pull down your highlights and books, nicely accessible as manipulatable data. And it's [open for contributions on GitHub](https://github.com/andjosh/readwise-ruby/tree/bab73880419d526691e701adfccf4b685ab793be).

## My Import Script

With the gem published, here is the actual import script I'm running now. Notably, it now:

- Reads and writes a last-import-date value to prevent accidentally importing old content.
- Downloads cover art and embeds it
- Builds on the `readwise` gem with custom formattig for books and highlights that I didn't want to include in the public gem.

    require 'time'
    require 'json'
    require 'net/http'
    require 'readwise'
    
    TOKEN = 'token'
    
    class DayOne
      def self.import_book(book, journal = 'Media Log')
        cmd = "dayone2 -j '#{journal}' --isoDate=#{book.highlighted_at_time.utc.iso8601} --tags #{book.formatted_tags}"
        if book.has_image?
          cmd += " --photos #{book.cover_image_name}"
        end
        puts "Importing #{book.readable_title}"
        IO.popen("#{cmd} -- new", 'r+') do |f|
          f.puts book.formatted_text
          f.close
        end
        book.cleanup_image
      end
    end
    
    module ReadwiseExtras
      module Book
        def has_image?
          cover_image_name && download_image
        end
    
        def download_image
          return false unless cover_image_name
          return true if File.exists?(cover_image_name)
    
          system "curl '#{cover_image_url}' -o #{cover_image_name}"
        end
    
        def cleanup_image
          return true unless has_image?
    
          system "rm #{cover_image_name}"
        end
    
        def cover_image_name
          return if cover_image_url.nil?
    
          extension = URI.parse(cover_image_url).path.split('/').last.match(/\.[a-z|A-Z]*$/)&.to_a&.first || '.jpg'
          book_id + extension
        end
    
        def formatted_text
          [
            readable_title,
            has_image? ? "[{photo}]" : nil,
            "### Metadata",
            "Author: #{author}",
            "Full Title: #{title}",
            "Category: #{category}",
            "URL: #{source_url}",
            "Readwise URL: #{readwise_url}",
            "### Highlights",
          ].concat(highlights.map { |h| h.formatted_text }).compact.join("\n")
        end
    
        def formatted_tags
          tags.map { |t| "##{t['name']}" }.concat([category]).join(' ')
        end
      end
    
      module Highlight
        def formatted_text
          pieces = ["> #{text}"]
          unless note.nil? || note.empty?
            pieces << note
          end
          unless tags.nil? || tags.empty?
            pieces << tags.map { |t| "##{t['name']}" }.join(', ')
          end
    
          pieces << ""
          pieces.join("\n\n")
        end
    
        def formatted_date
          Time.parse(highlighted_at || updated_at).to_date.to_s
        end
      end
    end
    Readwise::Book.include(ReadwiseExtras::Book)
    Readwise::Highlight.include(ReadwiseExtras::Highlight)
    
    class Importer
      LAST_SEEN_CACHE_FILENAME = '.readwise_import_last_seen_timestamp'
    
      def self.last_seen_timestamp
        @last_seen_timestamp ||= fetch_last_seen_timestamp
        raise "must set a #{LAST_SEEN_CACHE_FILENAME}" unless @last_seen_timestamp
    
        @last_seen_timestamp
      end
    
      def self.fetch_last_seen_timestamp
        unless File.exists?(LAST_SEEN_CACHE_FILENAME)
          return nil
        end
        file = File.new(LAST_SEEN_CACHE_FILENAME, 'r+')
        contents = file.read.chomp
        file.close
        return nil if contents.empty?
    
        Time.parse(contents)
      end
    
      def self.write_last_seen_timestamp(time)
        file = File.new(LAST_SEEN_CACHE_FILENAME, 'w+')
        file.write(time.iso8601)
        file.close
      end
    
      def self.import
        client = Readwise::Client.new(token: TOKEN)
        client.export(updated_after: last_seen_timestamp.utc.iso8601).filter do |book|
          book.highlights.any? && book.highlighted_at_time > last_seen_timestamp
        end.each do |book|
          DayOne.import_book(book)
          write_last_seen_timestamp(book.highlighted_at_time)
        end
      rescue
        puts 'An import of Readwise into Day One failed'
      end
    end
    
    Importer.import

