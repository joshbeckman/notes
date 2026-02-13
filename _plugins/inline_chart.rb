# frozen_string_literal: true

require 'digest/md5'

module Jekyll
  class InlineChartBlock < Liquid::Block
    def render(context)
      config = super.strip
      chart_id = "chart-#{Digest::MD5.hexdigest(config)[0, 8]}"

      <<~HTML
        <div class="chart-container" style="position:relative;margin:2rem 0;">
          <canvas id="#{chart_id}"></canvas>
        </div>
        <script>
        (function() {
          function init() {
            new Chart(document.getElementById('#{chart_id}'), #{config});
          }
          if (typeof Chart !== 'undefined') {
            init();
          } else {
            var s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js';
            s.onload = function() {
              var a = document.createElement('script');
              a.src = 'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3/dist/chartjs-adapter-date-fns.bundle.min.js';
              a.onload = init;
              document.head.appendChild(a);
            };
            document.head.appendChild(s);
          }
        })();
        </script>
      HTML
    end
  end
end

Liquid::Template.register_tag('chart', Jekyll::InlineChartBlock)
