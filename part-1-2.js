const fs = require('fs');
const inputRaw = fs.readFileSync('input.txt').toString();
const lines = inputRaw.replace(/\r/g, '').trim().split('\n');
const commands = lines.map(line => {
  const [a, b] = line.split(' ');
  switch (a) {
    case 'add':
    case 'ret':
      return [a];
    break;
    case 'jmpos':
      return [a, Number(b)];
    break;
    case 'push':
      if ([...'xyzXYZ'].includes(b)) {
        return [a, b.toLowerCase()];
      } else {
        return [a, Number(b)];
      }
    break;
  }
});

const n = 30;
let result = 0;
const sky = [];

for (let x = 0; x < n; x++) {
  sky[x] = [];
  for (let y = 0; y < n; y++) {
    sky[x][y] = [];
    for (let z = 0; z < n; z++) {
      const stack = [];
      let pc = 0;

      while_loop:
      while (true) {
        const cmd = commands[pc];
        // console.log(pc, stack, cmd);
        switch (cmd[0]) {
          case 'add':
            const a = stack.pop();
            const b = stack.pop();
            stack.push(a + b);
          break;
          case 'jmpos':
            
            if (stack.pop() >= 0) {
              pc += cmd[1];
            }
          break;
          case 'push':
            switch (cmd[1]) {
              case 'x':
                stack.push(x);
              break;
              case 'y':
                stack.push(y);
              break;
              case 'z':
                stack.push(z);
              break;
              default:
                stack.push(cmd[1]);
            }
          break;
          case 'ret':
            const snow = stack.at(-1);
            sky[x][y][z] = snow > 0 ? 1 : 0;
            result += snow;
          break while_loop;
        }
        // pc = (pc + 1) % commands.length;
        pc++;
      }
    }
  }
}

console.log('Part 1:', result);

// Part 2
let cloudCount = 0
for (let x = 0; x < n; x++) {
  for (let y = 0; y < n; y++) {
    for (let z = 0; z < n; z++) {
      if (sky[x][y][z] === 1) {
        cloudCount++;
        const q = [[x, y, z]];
        sky[x][y][z] = 0;
        let i = 0;
        while (i < q.length) {
          const c = q[i++];
          if (c[0] > 0 && sky[c[0] - 1][c[1]][c[2]]) {
            q.push([c[0] - 1, c[1], c[2]]);
            sky[c[0] - 1][c[1]][c[2]] = 0;
          }
          if (c[1] > 0 && sky[c[0]][c[1] - 1][c[2]]) {
            q.push([c[0], c[1] - 1, c[2]]);
            sky[c[0]][c[1] - 1][c[2]] = 0;
          }
          if (c[2] > 0 && sky[c[0]][c[1]][c[2] - 1]) {
            q.push([c[0], c[1], c[2] - 1]);
            sky[c[0]][c[1]][c[2] - 1] = 0;
          }
          if (c[0] < n - 1 && sky[c[0] + 1][c[1]][c[2]]) {
            q.push([c[0] + 1, c[1], c[2]]);
            sky[c[0] + 1][c[1]][c[2]] = 0;
          }
          if (c[1] < n - 1 && sky[c[0]][c[1] + 1][c[2]]) {
            q.push([c[0], c[1] + 1, c[2]]);
            sky[c[0]][c[1] + 1][c[2]] = 0;
          }
          if (c[2] < n - 1 && sky[c[0]][c[1]][c[2] + 1]) {
            q.push([c[0], c[1], c[2] + 1]);
            sky[c[0]][c[1]][c[2] + 1] = 0;
          }
        }
      }
    }
  }
}

console.log('Part 2:', cloudCount);
