set datafile separator ','

set term svg
set output "oss-contributions-stats.svg"

set key left top
set key autotitle columnhead
set xlabel ' '

set ylabel  'Merged Pull Request'
set y2label 'Contributed Projects'

set y2tics
set ytics nomirror

set mxtics 2
set mytics 2
set my2tics 2
set grid x,y,y2

set boxwidth 0.4
set style fill solid 1.00

unset border

set style data histograms
set boxwidth 1

set format y '%.0s %c'
set format y2 '%.0s %c'

plot 'oss-contributions-stats.csv' using 2:xticlabels(1) lt rgb "#5277C3", \
  '' using 3 lt rgb "#7EBAE4" axis x1y2
