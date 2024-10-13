# frozen_string_literal: true

class SiteVersion
  def initialize(site)
    @site = site
  end

  def inject
    @site.config['version'] = version
  end

  # Returns the version of the site
  # If the site is a git repository, it returns the output of `git describe --long`
  # Otherwise, it returns a string with the number of commits and the short hash of the last commit
  # ref: https://news.ycombinator.com/item?id=28155654
  def version
    `git describe --long 2>/dev/null | sed 's/\([^-]*-g\)/r\1/' || \
      printf "r%s-g%s" "$(git rev-list --count HEAD)" "$(git rev-parse --short HEAD)"`.strip
  end
end
Jekyll::Hooks.register :site, :after_init do |site|
  SiteVersion.new(site).inject
end
