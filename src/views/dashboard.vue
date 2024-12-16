<script setup lang="ts">

import Logo from "@/components/UI/Logo.vue";
import {onMounted, ref} from "vue";
import {Route} from "@/scripts/composableRoute";
import {ComposableUser} from "@/scripts/composableUser";
import {Chart, registerables} from "chart.js";
Chart.register(...registerables);

const loading = ref(false);
let route = ref<Route>();
let routeId: number = 1;
let recentRouteDate = ref<string>('');

const errorMessage = ref<string | null>(null);

onMounted(async() => {
loading.value = true;
try{
  const routes = await ComposableUser().getRoutes(routeId, 1);
  route.value = routes[0];
  if (route.value.dataPoints.length === 0) {
    errorMessage.value = 'No data in route';
    return;
  }
}
catch{
  errorMessage.value = 'Error loading route';
}
finally{
  loading.value = false;
}
recentRouteDate.value = new Date(route.value.dataPoints[0].timestamp).toLocaleString('en-GB', {day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric'});
drawMap();
drawGraph();
});

const drawMap = () => {
  var canvas = document.body.querySelector("#map") as HTMLCanvasElement;
  var ctx = canvas.getContext("2d");




  // Call drawRoute with the current route
  if (route.value) {
    drawRoute(route.value, ctx, canvas);
  }

};

// Draw the route on the map
function drawRoute(route: Route, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  const lats = route.dataPoints.map(point => point.lat);
  const lons = route.dataPoints.map(point => point.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);

  const startPoint = transformCoordinates(route.dataPoints[0].lat, route.dataPoints[0].lon, minLat, maxLat, minLon, maxLon, canvas.width, canvas.height);
  ctx.moveTo(startPoint.x, startPoint.y);

  route.dataPoints.forEach((point) => {
    const { x, y } = transformCoordinates(point.lat, point.lon, minLat, maxLat, minLon, maxLon, canvas.width, canvas.height);
    ctx.lineTo(x, y);
  });

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Function to transform latitude and longitude to canvas coordinates
function transformCoordinates(lat: number, lon: number, minLat: number, maxLat: number, minLon: number, maxLon: number, canvasWidth: number, canvasHeight: number) {
  const x = ((lon - minLon) / (maxLon - minLon)) * canvasWidth;
  const y = canvasHeight - ((lat - minLat) / (maxLat - minLat)) * canvasHeight;
  return { x, y };
}

const highlightPointOnMap = (index: number) => {
  const canvas = document.getElementById('map') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx || !route.value) return;

  const point = route.value.dataPoints[index];
  const lats = route.value.dataPoints.map(point => point.lat);
  const lons = route.value.dataPoints.map(point => point.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);

  const { x, y } = transformCoordinates(point.lat, point.lon, minLat, maxLat, minLon, maxLon, canvas.width, canvas.height);

  // Clear the canvas and redraw the route
  drawRoute(route.value, ctx, canvas);

  // Highlight the point
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--Primary-solid').trim();
  ctx.fill();
};

const drawGraph = () => {
  var canvas = document.body.querySelector("#graph") as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  if (route.value) {
    const speeds = route.value.dataPoints.map(point => point.speed);
    const timestamps = route.value.dataPoints.map(point => point.timestamp);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [{
          label: 'Speed',
          data: speeds,
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--Primary-solid').trim(),
          borderWidth: 2,
          fill: false
        }]
      },
      options: {
        scales: {
          x: {
            ticks:{
              display: false
            },
            title: {
              display: false,
              text: 'Timestamp',
              color: 'white'
            }
          },
          y: {
            ticks:{
              display: false
            },
            title: {
              display: false,
              text: 'Speed',
              color: 'white'
            }
          }
        },
        plugins: {
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                highlightPointOnMap(context.dataIndex);
                return `Speed: ${context.raw}`;
              }
            }
          }
        }
      }
    });
  }
};


</script>

<template>
  <div class="window">
    <div class="header">
      <div class="logo">
        <Logo :loading="loading"/>
      </div>
      <div class="page-buttons">
        <p>Routes</p>
        <p>Account</p>
      </div>
    </div>
    <div class="title">
      <p>Recent lap:</p>
      <p id="recent-lap-date">{{recentRouteDate}}</p>
    </div>
    <div class="main">
      <div class="graph">
        <canvas id="graph"></canvas>
      </div>
      <div class="lap">
        <canvas id="map"></canvas>
      </div>
    </div>
    <div class="buttons">

    </div>
    <div class="footer">

    </div>
  </div>
</template>

<style scoped>

.window {
  display: flex;
  height: 100vh;
  width: 100vw;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: var(--Text-color);
  background-color: var(--Background-color);
}

.header {
  display: flex;
  padding: 16px 32px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
}

.page-buttons {
  display: flex;
  width: 252px;
  align-items: center;
  gap: 32px;

  p {
    color: #FFF;
    font-size: 24px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
  }
}

.title {
  display: flex;
  height: 49px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 32px;
  flex-shrink: 0;
  align-self: stretch;

  p{
    color: #FFF;
    font-size: 24px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
  }
}

.main {
  display: flex;
  padding: 10px 32px;
  justify-content: space-evenly;
  align-items: center;
  flex: 1 0 0;
  align-self: stretch;
}

.graph {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  width: 800px; /* Adjust the width as needed */
  height: 600px; /* Adjust the height as needed */
}

.graph canvas {
  margin:auto;
  width: 100%;
  height: 100%;
}

.lap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  width: 800px; /* Adjust the width as needed */
  height: 600px; /* Adjust the height as needed */
}

.lap canvas {
  margin:auto;
  width: 50%;
  height: 50%;
}

.buttons {
  display: flex;
  padding: 10px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
}

.footer {
  display: flex;
  height: 120px;
  padding: 10px;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
}

</style>