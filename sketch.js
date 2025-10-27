let table;

function preload() {
  // 加载数据文件
  table = loadTable("assets/dataset.csv", "csv", "header");
}

function setup() {
  let outerPadding = 20;
  let padding = 10;
  let itemSize = 50;

  let cols = floor((windowWidth - outerPadding * 2) / (itemSize + padding));
  let rows = ceil(table.getRowCount() / cols);
  let totalHeight = outerPadding * 2 + rows * itemSize + (rows - 1) * padding;

  createCanvas(windowWidth, totalHeight);
  background("black");
  angleMode(RADIANS);
  noLoop();

  let colCount = 0;
  let rowCount = 0;

  for (let r = 0; r < table.getRowCount(); r++) {
    let data = table.getRow(r).obj;

    // === 数据映射到几何属性 ===
    let nPoints = floor(map(Number(data.column0), minCol(table, "column0"), maxCol(table, "column0"), 5, 12));
    let radius = map(Number(data.column1), minCol(table, "column1"), maxCol(table, "column1"), 10, 25);
    let rotation = map(Number(data.column3), minCol(table, "column3"), maxCol(table, "column3"), 0, TWO_PI);
    let scaleFactor = map(Number(data.column4), minCol(table, "column4"), maxCol(table, "column4"), 0.8, 1.3);

    // 每个圆的主色（由 column2 决定）
    let baseHue = map(Number(data.column2), minCol(table, "column2"), maxCol(table, "column2"), 0, 360);

    // 定位每个图形位置
    let x = outerPadding + colCount * (itemSize + padding) + itemSize / 2;
    let y = outerPadding + rowCount * (itemSize + padding) + itemSize / 2;

    drawCircleWithTriangles(x, y, nPoints, radius, rotation, scaleFactor, baseHue);

    colCount++;
    if (colCount == cols) {
      colCount = 0;
      rowCount++;
    }
  }
}

// === 绘制带彩色边框与三角形的圆形 ===
function drawCircleWithTriangles(cx, cy, nPoints, radius, rotation, scaleFactor, baseHue) {
  push();
  translate(cx, cy);
  rotate(rotation);
  scale(scaleFactor);
  colorMode(HSB, 360, 100, 100, 100);

  // 外层圆形轮廓 + 彩色边框
  noFill();
  stroke(baseHue, 80, 100); // 圆周边框颜色
  strokeWeight();
  ellipse(0, 0, radius * 2);

  // 生成圆周点
  let points = [];
  for (let i = 0; i < nPoints; i++) {
    let angle = map(i, 0, nPoints, 0, TWO_PI);
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    points.push(createVector(x, y));
  }

  // 绘制内部彩色三角形
  let nTriangles = floor(random(2, nPoints / 2));
  for (let t = 0; t < nTriangles; t++) {
    let a = floor(random(points.length));
    let b = floor(random(points.length));
    let c = floor(random(points.length));

    while (b === a) b = floor(random(points.length));
    while (c === a || c === b) c = floor(random(points.length));

    let triHue = (baseHue + random(-30, 30) + 360) % 360; // 色调变化
    stroke(triHue, 100, 100, 80);
    fill(triHue, 80, 100, 40);

    beginShape();
    vertex(points[a].x, points[a].y);
    vertex(points[b].x, points[b].y);
    vertex(points[c].x, points[c].y);
    endShape(CLOSE);
  }

  pop();
}

// 工具函数
function minCol(table, colName) {
  return min(table.getColumn(colName).map(Number));
}
function maxCol(table, colName) {
  return max(table.getColumn(colName).map(Number));
}

function draw() {}
