; ============================================
; Ejemplo 3: Promedio de dos números
; (8 + 6) / 2 = 7
; ============================================
; Combina FLD, FADD, FDIV y FST.
; ============================================

        ORG 0000h

        FLD N1          ; ST(0) = 8
        FLD N2          ; ST(0) = 6, ST(1) = 8
        FADD            ; ST(0) = 14
        FLD DOS         ; ST(0) = 2, ST(1) = 14
        FDIV            ; ST(0) = 7
        FST PROM        ; guarda 7 en PROM
        HLT

N1:     DB 8
N2:     DB 6
DOS:    DB 2
PROM:   DB 0
