import * as d3 from 'd3';

import csv from './data/data.csv';

const margin = { top: 40, right: 20, bottom: 20, left: 60 },
  height = 500 - margin.top - margin.bottom,
  width = 1000 - margin.left - margin.right;

let entries = [];
let values = [];

d3.csv(csv, function(d) {
  if (d.Year) {
    return {
      year: d.Year,
      attendence: d.Attendance
    };
  }
}).then(function(data) {
  entries = d3
    .nest()
    .key(function(d) {
      return d.year;
    })
    .sortKeys(d3.ascending)
    .entries(data);
  values = d3
    .nest()
    .key(function(d) {
      return d.attendence;
    })
    .sortKeys((a, b) => {
      return parseInt(a, 10) - parseInt(b, 10);
    })
    .entries(data);
  console.log(entries);
  Draw();
});

const svg = d3
  .select('#chart')
  .append('svg')
  .attr('width', 1000)
  .attr('height', 500);

function Draw() {
  const sum = [];
  entries.map(item =>
    sum.push(
      item.values.filter(item => item.attendence).reduce((a, b) => {
        return a + parseInt(b.attendence, 10) || 0;
      }, 0)
    )
  );
  const x = d3
    .scaleBand()
    .domain(entries.map(item => item.key))
    .range([margin.left, width + margin.left])
    .padding(0.2);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(sum)])
    .range([margin.top + height, margin.top]);

  svg
    .append('g')
    .attr('transform', `translate(0,${margin.top + height})`)
    .call(d3.axisBottom(x));

  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).scale(y));

  const rect = svg.selectAll('rect').data(entries);

  rect
    .enter()
    .append('rect')
    .attr('x', d => x(d.key))
    .attr('y', (d, i) => y(sum[i]))
    .attr('width', x.bandwidth())
    .attr('height', (d, i) => height - y(sum[i]) + margin.top);
}
