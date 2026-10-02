# frozen_string_literal: true

# jekyll-feed renders only `post.content`, which is the post's own body — the
# rating, exercise stats, and weather a reader sees come from the layouts, so
# they never reached the feed. Patch the feed template before it renders, so
# each entry appends the same includes the layouts use.
#
# Patching the gem's template (rather than shipping a copy of feed.xml) keeps
# jekyll-feed's own template authoritative: upgrades still land, and this
# affects the main feed and every category feed without a file per feed.
module FeedMetadata
  # jekyll-feed's own feeds are the only ones carrying this; the site's podcast
  # and iCal feeds declare the Atom namespace too, so the namespace alone is not
  # enough to identify a page worth patching.
  JEKYLL_FEED_GENERATOR = '<generator uri="https://jekyllrb.com/"'
  MARKER = "{{ post.content | strip }}"
  # The includes are written for readability, so their indentation is most of
  # the injected bytes. HTML collapses that whitespace anyway, and these blocks
  # contain no <pre>, so normalizing costs nothing and halves the feed.
  INJECTION = "#{MARKER}{% capture feed_meta %}{% include PostMeta.html post=post %}" \
              "{% endcapture %}{{ feed_meta | normalize_whitespace }}"

  def self.patch(page, *)
    content = page.content
    return unless content.is_a?(String) && content.include?(JEKYLL_FEED_GENERATOR)

    # Warn rather than fail the build: a feed without metadata is worse than it
    # was, but a broken deploy is worse than both.
    unless content.include?(MARKER)
      Jekyll.logger.warn "Feed metadata:", "#{page.path} has no #{MARKER.inspect} — jekyll-feed's template changed"
      return
    end

    page.content = content.sub(MARKER, INJECTION)
  end
end

Jekyll::Hooks.register :pages, :pre_render, &FeedMetadata.method(:patch)
