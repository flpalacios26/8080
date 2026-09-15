// fpu.js
// Co-procesador de punto flotante estilo Intel 8087 (simplificado)

class FPU {
  constructor() {
    this.stack = new Array(8).fill(0);
    this.top = 0;
    this.control = { roundMode: 0 };
    this.status = { C0:0, C1:0, C2:0, C3:0, IE:0, ZE:0, OE:0, UE:0, PE:0 };
    this.instruction = null;
    this.busy = false;
    this.dataPort = 0;
    this.commandPort = 0;
    this.resultPort = 0;
    this.statusPort = 0;
  }

  push(v) { this.top = (this.top + 1) % 8; this.stack[this.top] = v; }
  pop() { const v = this.stack[this.top]; this.top = (this.top - 1 + 8) % 8; return v; }
  peek() { return this.stack[this.top]; }
  poke(v) { this.stack[this.top] = v; }

  clearExceptions() {
    this.status.IE = this.status.ZE = this.status.OE = 0;
    this.status.UE = this.status.PE = 0;
  }

  execute(opcode) {
    this.busy = true;
    this.instruction = opcode;
    this.clearExceptions();
    try {
      switch (opcode) {
        case 0x01: this.push(this.dataPort); break;
        case 0x02: this.resultPort = this.peek(); break;
        case 0x03: { const a = this.pop(); this.poke(a + this.peek()); break; }
        case 0x04: { const a = this.pop(); this.poke(a - this.peek()); break; }
        case 0x05: { const a = this.pop(); this.poke(a * this.peek()); break; }
        case 0x06: {
          const a = this.pop();
          const b = this.peek();
          if (b === 0) { this.status.ZE = 1; this.poke(Infinity); }
          else this.poke(a / b);
          break;
        }
        case 0x07:
          if (this.peek() < 0) { this.status.IE = 1; this.poke(NaN); }
          else this.poke(Math.sqrt(this.peek()));
          break;
        case 0x08: this.poke(Math.sin(this.peek())); break;
        case 0x09: this.poke(Math.cos(this.peek())); break;
        case 0x0A: this.resultPort = Math.trunc(this.peek()) & 0xFF; break;
        case 0x0B: this.statusPort = this.readStatus(); break;
        default: this.status.IE = 1;
      }
    } catch (e) { this.status.IE = 1; }
    this.busy = false;
  }

  readStatus() {
    let s = 0;
    s |= (this.status.C0 & 1) << 0;
    s |= (this.status.C1 & 1) << 1;
    s |= (this.status.C2 & 1) << 2;
    s |= (this.status.C3 & 1) << 3;
    s |= (this.status.IE & 1) << 4;
    s |= (this.status.ZE & 1) << 5;
    s |= (this.status.OE & 1) << 6;
    s |= (this.status.UE & 1) << 7;
    return s & 0xFF;
  }

  reset() {
    this.stack.fill(0);
    this.top = 0;
    this.clearExceptions();
    this.status.C0 = this.status.C1 = this.status.C2 = this.status.C3 = 0;
    this.instruction = null;
    this.busy = false;
    this.dataPort = this.commandPort = this.resultPort = this.statusPort = 0;
  }
}

window.FPU = FPU;
