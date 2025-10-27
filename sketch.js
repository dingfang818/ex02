let table;
let circles = [];

function preload() {
  table = loadTable("assets/dataset.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  angleMode(RADIANS);
  noLoop();

  let outerPadding = 20;
  let padding = 10;
  let itemSize = 50;

  let cols = floor((windowWidth - outerPadding * 2) / (itemSize + padding));
  let rows = ceil(table.getRowCount() / cols);

  let colCount = 0;
  let rowCount = 0;

  for (let r = 0; r < table.getRowCount(); r++) {
    let data = table.getRow(r).obj;

    let nPoints = floor(map(Number(data.column0), minCol(table, "column0"), maxCol(table, "column0"), 5, 12));
    let radius = map(Number(data.column1), minCol(table, "column1"), maxCol(table, "column1"), 10, 25);
    let scaleFactor = map(Number(data.column4), minCol(table, "column4"), maxCol(table, "column4"), 0.8, 1.3);
    let baseHue = map(Number(data.column2), minCol(table, "column2"), maxCol(table, "column2"), 0, 360);

    let x = outerPadding + colCount * (itemSize + padding) + itemSize / 2;
    let y = outerPadding + rowCount * (itemSize + padding) + itemSize / 2;

    // 生成圆周点
    let points = [];
    for (let i = 0; i < nPoints; i++) {
      let angle = map(i, 0, nPoints, 0, TWO_PI);
      points.push(createVector(cos(angle) * radius, sin(angle) * radius));
    }

    // 生成三角形并固定颜色
    let triangles = [];
    let nTriangles = floor(random(2, nPoints / 2));
    for (let t = 0; t < nTriangles; t++) {
      let a = floor(random(points.length));
      let b = floor(random(points.length));
      let cIdx = floor(random(points.length));
      while (b === a) b = floor(random(points.length));
      while (cIdx === a || cIdx === b) cIdx = floor(random(points.length));

      let triHue = (baseHue + random(-20, 20) + 360) % 360;
      let phase = random(TWO_PI); // 每个三角形的漂动相位
      triangles.push({indices: [a, b, cIdx], color: triHue, phase: phase});
    }

    circles.push({x, y, scaleFactor, radius, points, triangles});

    colCount++;
    if (colCount == cols) {
      colCount = 0;
      rowCount++;
    }
  }
}

function draw() {
  background(0);

  for (let c of circles) {
    push();
    translate(c.x, c.y);
    scale(c.scaleFactor);

    // 圆透明，无边框
    noFill();
    noStroke();
    ellipse(0, 0, c.radius * 2);

    // 悬停检测
    let hover = dist(mouseX, mouseY, c.x, c.y) < c.radius * c.scaleFactor;

    for (let tri of c.triangles) {
      fill(tri.color, 80, 100, 40);

      if (hover) {
        stroke(tri.color, 100, 100, 80); // 显示边框
        strokeWeight(1.5);
      } else {
        noStroke();
      }

      beginShape();
      for (let idx of tri.indices) {
        let p = c.points[idx];
        let yOffset = 0;
        if (hover) {
          // 鼠标悬停时上下轻微飘动
          yOffset = sin(frameCount * 0.1 + tri.phase + idx) * 6; // 2像素幅度
        }
        vertex(p.x, p.y + yOffset);
      }
      endShape(CLOSE);
    }

    pop();
  }
}

// 工具函数
function minCol(table, colName) {
  return min(table.getColumn(colName).map(Number));
}
function maxCol(table, colName) {
  return max(table.getColumn(colName).map(Number));
}

function mouseMoved() {
  redraw(); // 鼠标移动时刷新画布
}
