; ============================================
; Ejemplo 4: División por cero
; Demuestra el flag ZE (Zero Divide) del FPU.
; Al ejecutar FDIV con divisor 0, se activa ZE.
; ============================================

        ORG 0000h

        FLD NUM         ; ST(0) = 5
        FLD CERO        ; ST(0) = 0, ST(1) = 5
        FDIV            ; ST(0) = Inf, flag ZE activado
        FST RES         ; guarda resultado
        HLT

NUM:    DB 5
CERO:   DB 0
RES:    DB 0
