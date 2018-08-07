import * as d3 from 'd3';

import './css/style.sass';

import csv from './data/data.csv';

const margin = { top: 40, right: 20, bottom: 30, left: 100 },
  height = 500 - margin.top - margin.bottom,
  width = 1000 - margin.left - margin.right;

let entries = [];
let pairs = [];

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
  entries.map(item => {
    pairs.push({
      key: item.key,
      value: item.values.filter(item => item.attendence).reduce((a, b) => {
        return a + parseInt(b.attendence, 10) || 0;
      }, 0)
    });
  });
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
    .attr('class', 'grid')
    .attr('transform', `translate(${margin.left},0)`)
    .call(
      d3
        .axisLeft(y)
        .scale(y)
        .tickSize(-width, 0, 0)
    );

  // y axis label
  svg
    .append('text')
    .attr('x', -height / 2 - margin.top)
    .attr('y', 40)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Amount of audience');

  //  legend
  svg
    .append('text')
    .attr('x', width / 2 + margin.left)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .text('FIFA audience of years');

  // x axis label
  svg
    .append('text')
    .attr('x', width / 2 + margin.left)
    .attr('y', height + margin.top + margin.bottom)
    .attr('text-anchor', 'middle')
    .text('Year');

  const rect = svg.selectAll('rect').data(pairs);

  rect
    .enter()
    .append('rect')
    .attr('fill', 'steelblue')
    .attr('x', d => x(d.key))
    .attr('y', d => y(d.value))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.value) + margin.top);

  svg
    .selectAll('rect')
    .on('mouseenter', function(d, i) {
      d3.select(this)
        .transition()
        .attr('opacity', 0.6)
        .attr('x', d => x(d.key) - 2)
        .attr('width', x.bandwidth() + 4);

      const y12 = y(d.value);

      svg
        .append('line')
        .attr('id', 'limit')
        .attr('x1', margin.left)
        .attr('y1', y12)
        .attr('x2', x(d.key) + x.bandwidth())
        .attr('y2', y12)
        .attr('stroke', 'green');
    })
    .on('mouseleave', function() {
      d3.select(this)
        .transition()
        .attr('opacity', 1)
        .attr('x', d => x(d.key))
        .attr('width', x.bandwidth());

      d3.select('#limit').remove();
    });
}
