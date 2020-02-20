# Homelessness in the USA Dashboard

This Dashboard visualizes data from the Department of Housing and Urban Development (HUD) on point in time counts (PIT) and housing inventory counts (HIC) from 2007 to 2019.

[Here is a link to the data source.](https://www.hudexchange.info/resource/3031/pit-and-hic-data-since-2007/ "HUD website")

### The dashboard is hosted by heroku [here](https://dashboard-homelessness-usa.herokuapp.com/ "Visit the Dashboard")

The data is stored in a SQLite database then converted to JSON format and served by a Python Flask app. Dashboard elements include a [choropleth](https://en.wikipedia.org/wiki/Choropleth_map "What's a choropleth?") created using the Javascript library [Leaflet](https://leafletjs.com/ "Leaflet Website"), a radial chart and line chart created using the Javascript library [ApexCharts](https://apexcharts.com/ "ApexCharts Website"). 

Clicking on a state or year in the choropleth updates all other elements of the dashboard to show data for the most recently selected state and year.
The line chart shows a side by side comparison of homelessness and available shelter beds by year for the selected state. The radial chart shows a breakdown of categories of homeless, mouse over each ring to see that category and its percentage of total homeless in that state for that year.

![Dashboard](Dashboard.png)
