# frozen_string_literal: true

Jekyll::Hooks.register :site, :post_write do |site|
  next unless system("which terminal-notifier > /dev/null 2>&1")

  icon = File.join(site.source, "assets", "img", "profile.png")
  system(
    "terminal-notifier",
    "-message", "Build complete",
    "-title", "Jekyll",
    "-group", site.source,
    "-contentImage", icon
  )
end
