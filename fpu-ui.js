// fpu-ui.js
// Actualiza el panel visual del co-procesador FPU

function formatFPUValue(v) {
    if (typeof v !== 'number') return String(v);
    if (Number.isNaN(v)) return 'NaN';
    if (!Number.isFinite(v)) return v > 0 ? '+∞' : '-∞';
    if (Number.isInteger(v)) return v.toFixed(1);
    return v.toFixed(6);
}

function updateFPUPanel() {
    if (typeof cpu === 'undefined' || !cpu.fpu) return;
    const fpu = cpu.fpu;

    // LED de actividad
    const led = document.getElementById('fpu-activity');
    const stateEl = document.getElementById('fpu-state');
    if (led && stateEl) {
        if (fpu.busy) {
            led.classList.add('active');
            stateEl.textContent = 'Procesando...';
        } else {
            led.classList.remove('active');
            stateEl.textContent = 'Idle';
        }
    }

    // Tabla de pila ST(0)-ST(7)
    const stackEl = document.getElementById('fpu-stack-table');
    if (stackEl) {
        stackEl.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const regIndex = (fpu.top - i + 8) % 8;
            const value = fpu.stack[regIndex];
            const div = document.createElement('div');
            div.className = 'fpu-reg-row' + (i === 0 ? ' st0' : '');
            div.innerHTML = `<span>ST(${i})</span><span>${formatFPUValue(value)}</span>`;
            stackEl.appendChild(div);
        }
    }

    // Flags FPU
    ['C0','C1','C2','C3','IE','ZE','OE','UE','PE'].forEach(flag => {
        const el = document.getElementById(`fpu-flag-${flag}`);
        if (!el) return;
        const active = fpu.status[flag] === 1;
        el.textContent = fpu.status[flag];
        el.parentElement.classList.toggle('active', active);
    });

    // Última instrucción
    const instrEl = document.getElementById('fpu-last-instr');
    if (instrEl) {
        if (fpu.instruction !== null && fpu.instruction !== undefined) {
            const names = {
                0x01: 'FLD', 0x02: 'FST', 0x03: 'FADD', 0x04: 'FSUB',
                0x05: 'FMUL', 0x06: 'FDIV', 0x07: 'FSQRT', 0x08: 'FSIN',
                0x09: 'FCOS', 0x0A: 'FINT', 0x0B: 'FSTAT'
            };
            const name = names[fpu.instruction] || '???';
            instrEl.textContent = `${name} (0x${fpu.instruction.toString(16).padStart(2,'0').toUpperCase()})`;
        } else {
            instrEl.textContent = '—';
        }
    }
}
