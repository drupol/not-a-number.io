stats:
  gnuplot oss-contributions-stats.gnuplot

build:
  HUGO_LAST_COMMIT=$(git rev-parse --short=12 HEAD) hugo --gc --minify --panicOnWarning

serve:
  HUGO_LAST_COMMIT=$(git rev-parse --short=12 HEAD) hugo server --buildDrafts --enableGitInfo --forceSyncStatic -F
