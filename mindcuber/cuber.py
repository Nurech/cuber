#-----------------------------------------------------------------------------
# Title:        MindCuber-RI
#
# Author:       David Gilday
#
# Copyright:    (C) 2021 David Gilday
#
# Website:      http://mindcuber.com
#
# Version:      v1p0
#
# Modified:     $Date: 2021-03-28 13:59:19 +0100 (Sun, 28 Mar 2021) $
#
# Revision:     $Revision: 7875 $
#
# Usage:
#
#   This software may be used for any non-commercial purpose providing
#   that the original author is acknowledged.
#
# Disclaimer:
#
#   This software is provided 'as is' without warranty of any kind, either
#   express or implied, including, but not limited to, the implied warranties
#   of fitness for a purpose, or the warranty of non-infringement.
#
#-----------------------------------------------------------------------------
# Purpose:      Main program for MindCuber-RI robot Rubik's Cube solver
#-----------------------------------------------------------------------------

import gc, time, hub
hub.display.show(hub.Image.DIAMOND)
gc.collect()

def trace(msg):
    if False:
        gc.collect()
        print("TRACE: "+msg+" mem="+str(gc.mem_free()))

trace("loading mindcuberri_v1p0")

import mcrisolver_v1p0
import mcrimaps_v1p0
import mcricolors_v1p0

trace("mindcuberri")

scan_mid   = 135
scan_edg   = 105
scan_crn   = 90
scan_awy   = 40
scan_rst   = -140

scan_speed = 75
scan_pwr   = 80

turn_mul   = 60
turn_div   = 20
turn_3     = int(turn_mul* 3/turn_div)
turn_45    = int(turn_mul*45/turn_div)
turn_90    = int(turn_mul*90/turn_div)

FACE       = hub.Image('60990:60990:00000:60990:60990')
FACE_LEFT  = hub.Image('60990:60990:00000:06099:06099')
FACE_RIGHT = hub.Image('06099:06099:00000:60990:60990')
FACE_BLNK0 = hub.Image('60060:60060:00000:60060:60060')
FACE_BLNK1 = hub.Image('60000:60000:00000:60000:60000')

def GetPorts():
    global c, cm, portscan
    global sensor_dist, sensor_color, motor_scan, motor_turn, motor_tilt
    mcrisolver_v1p0.init(mcricolors_v1p0, mcrimaps_v1p0)
    c   = mcrisolver_v1p0.cube()
    cm  = mcrisolver_v1p0.cm
    c.alloc_colors()
    hub.led(0, 0, 0)
    hub.display.clear()
    portscan = True
    while portscan:
        time.sleep_ms(100)
        portscan = False
        sensor_dist   = check_port(hub.port.A, False, [62],     0, 0)
        sensor_color  = check_port(hub.port.C, False, [61],     0, 2)
        motor_scan    = check_port(hub.port.E, True,  [48, 75], 0, 4)
        motor_turn    = check_port(hub.port.D, True,  [48, 75], 4, 2)
        motor_tilt    = [
                            check_port(hub.port.B, True,  [48, 75], 4, 0),
                            check_port(hub.port.F, True,  [48, 75], 4, 4)
                        ]

def check_port(port, motor, t, x, y):
    if motor:
        dev = port.motor
    else:
        dev = port.device
    if dev != None and (port.info()['type'] in t):
        hub.display.pixel(x, y, 0)
    else:
        if dev != None:
            print("check_port: "+str(port.info()['type']))
        global portscan
        portscan = True
        hub.display.pixel(x, y, 9)
    return dev

def Position(mot):
    return mot.get()[1]

def run_wt(mot, pos, off):
    while abs(mot.get()[1]-pos) > off:
        time.sleep_ms(1)

def run_wt_up(mot, pos):
    while mot.get()[1] < pos:
        time.sleep_ms(1)

def run_wt_dn(mot, pos):
    while mot.get()[1] > pos:
        time.sleep_ms(1)

def run_wt_dir(mot, pos, off):
    if off < 0:
        while mot.get()[1] < pos:
            time.sleep_ms(1)
    else:
        while mot.get()[1] > pos:
            time.sleep_ms(1)

def run_nw(mot, pos, speed):
    mot.run_to_position(pos, speed=speed, max_power=speed, stall=False, acceleration=100, deceleration=100, stop=mot.STOP_HOLD)

def run_to(mot, pos, speed):
    mot.run_to_position(pos, speed=speed, max_power=speed, stall=False, acceleration=100, deceleration=100, stop=mot.STOP_HOLD)
    run_wt(mot, pos, 3)

def ScanReset():
    ColorOff()
    motor_scan.pwm(55)
    pos1 = Position(motor_scan)
    pos0 = pos1-100
    while pos1 > pos0:
        time.sleep_ms(100)
        pos0 = pos1
        pos1 = Position(motor_scan)
    global motor_scan_base
    motor_scan_base = Position(motor_scan)+scan_rst
    run_to(motor_scan, motor_scan_base, scan_pwr)
    motor_scan.brake()

def ScanPiece(spos, tpos, f, o, i, back = False):
    global slower
    spos += motor_scan_base
    run_nw(motor_scan, spos, 100)
    pos = Position(motor_scan)
    ScanDisp(i)
    if back:
        run_wt_dn(motor_turn, tpos+3)
    else:
        run_wt_up(motor_turn, tpos-3)
    ScanRGB(f, o)
    off = Position(motor_scan)-spos
    if pos < spos:
        if off < -5:
            slower += 1
    else:
        if off > 5:
            slower += 1

def TurnReset():
    global motor_turn_base
    motor_turn_base = Position(motor_turn)
    motor_turn.brake()

def TurnRotate(rot):
    TiltAway()
    global motor_turn_base
    motor_turn_base = motor_turn_base+turn_90*rot
    run_nw(motor_turn, motor_turn_base, 100)
    run_wt(motor_turn, motor_turn_base, turn_45)

def TurnTurn(rot, rotn):
    extra  = turn_3*4
    extran = turn_3
    if rot < 0:
        extra = -extra
    if rotn < 0:
        extra -= extran
    elif rotn > 0:
        extra += extran
    global motor_turn_base
    motor_turn_base = motor_turn_base+turn_90*rot
    pos = motor_turn_base+extra
    run_nw(motor_turn, pos, 100)
    time.sleep_ms(20)
    TiltHold()
    run_wt(motor_turn, pos, 3)
    run_nw(motor_turn, motor_turn_base, 100)

def TiltReset():
    mot0 = motor_tilt[0]
    mot1 = motor_tilt[1]
    mot0.pwm(-40)
    mot1.pwm(40)
    pos1 = [Position(mot0), Position(mot1)]
    pos0 = [pos1[0]+100, pos1[1]-100]
    while pos1[0] < pos0[0] or pos1[1] > pos0[1]:
        time.sleep_ms(200)
        pos0 = pos1
        pos1 = [Position(mot0), Position(mot1)]
    bwd0 = Position(mot0)
    bwd1 = Position(mot1)
    mot0 = motor_tilt[0]
    mot1 = motor_tilt[1]
    mot0.pwm(40)
    mot1.pwm(-40)
    pos1 = [Position(mot0), Position(mot1)]
    pos0 = [pos1[0]-100, pos1[1]+100]
    while pos1[0] > pos0[0] or pos1[1] < pos0[1]:
        time.sleep_ms(200)
        pos0 = pos1
        pos1 = [Position(mot0), Position(mot1)]
    fwd0 = Position(mot0)-3
    fwd1 = Position(mot1)+3
    global motor_tilt_fwd, motor_tilt_hld, motor_tilt_bwd
    motor_tilt_fwd = [fwd0, fwd1]
    motor_tilt_hld = [fwd0-32, fwd1+32]
    motor_tilt_bwd = [fwd0-67, fwd1+67]
    trace("tilt "+str(motor_tilt_fwd)+" "+str(motor_tilt_hld)+" "+str(motor_tilt_bwd))
    trace("bwd "+str([bwd0, bwd1]))
    if fwd0-bwd0 < 60 or bwd1-fwd1 < 60:
        fatal_error()
    TiltAway()

def TiltAway():
    run_nw(motor_tilt[0], motor_tilt_bwd[0], 100)
    run_nw(motor_tilt[1], motor_tilt_bwd[1], 100)
    run_wt_dn(motor_tilt[0], motor_tilt_hld[0]-6)
    run_wt_up(motor_tilt[1], motor_tilt_hld[1]+6)

def TiltHold():
    run_nw(motor_tilt[0], motor_tilt_hld[0], 100)
    run_nw(motor_tilt[1], motor_tilt_hld[1], 100)

def TiltTilt(mid0, scan = False):
    mid1 = 1-mid0
    pwr  = 100
    pwra = -40
    bwd  = -20
    fwd  = -10
    hld  = 10
    if mid0 == 1:
        pwr  = -pwr
        pwra = -pwra
        bwd  = -bwd
        fwd  = -fwd
        hld  = -hld
    run_nw(motor_tilt[mid1], motor_tilt_bwd[mid1], 100)
    if abs(Position(motor_tilt[mid0])-motor_tilt_hld[mid0])>10:
        run_to(motor_tilt[mid0], motor_tilt_hld[mid0], 100)
    run_wt_dir(motor_tilt[mid1], motor_tilt_bwd[mid1]+bwd, bwd)
    motor_tilt[mid0].pwm(pwr)
    run_wt_dir(motor_tilt[mid0], motor_tilt_fwd[mid0]+fwd, fwd)
    time.sleep_ms(100)
    motor_tilt[mid1].pwm(-pwr)
    time.sleep_ms(10)
    motor_tilt[mid0].pwm(pwra)
    if scan:
        run_nw(motor_scan, motor_scan_base+scan_mid, scan_pwr)
    run_wt_dir(motor_tilt[mid1], motor_tilt_hld[mid1]+hld, hld)
    run_nw(motor_tilt[mid0], motor_tilt_hld[mid0], 100)
    run_nw(motor_tilt[mid1], motor_tilt_hld[mid1], 100)

def ColorOff():
    sensor_color.mode(2)

def ColorOn():
    sensor_color.mode(5)

def CubeWait(img):
    global wait_count
    if wait_count <= 0:
        Show(img)
        Eyes(0,0,3,3)
        wait_count = 200
    elif wait_count == 180 or wait_count == 20:
        hub.display.clear()
        Eyes()
    elif wait_count == 160:
        Show(FACE)
    wait_count -= 1

def CubeSense():
    cm = sensor_dist.get(sensor_dist.FORMAT_SI)[0]
    # print(cm)
    return cm != None and cm < 6

def CubeRemove():
    global wait_count
    wait_count = 0
    count      = 0
    while count < 150:
        count += 1
        if CubeSense():
            count = 0
        CubeWait(hub.Image.ARROW_W)
        time.sleep_ms(10)
    Show(FACE)
    Eyes()

def CubeInsert():
    global motor_turn_base
    global wait_count
    wait_count = 0
    hub.button.left.presses()
    hub.button.right.presses()
    count = 0
    sel   = 0
    while count < 150:
        count += 1
        if not CubeSense():
            count = 0
        CubeWait(hub.Image.ARROW_E)
        if hub.button.left.presses() > 0:
            # print("left")
            motor_turn_base -= int(turn_mul*2/turn_div)
            run_nw(motor_turn, motor_turn_base, 40)
        if hub.button.right.presses() > 0:
            # print("right")
            motor_turn_base += int(turn_mul*2/turn_div)
            run_nw(motor_turn, motor_turn_base, 40)
        time.sleep_ms(10)
    Show(FACE)
    Eyes()

def Init():
    GetPorts()
    Show(FACE)
    ScanReset()
    if CubeSense():
        CubeRemove()
    TiltReset()
    TurnReset()

def Eyes(a=0, b=0, c=0, d=0):
    sensor_dist.mode(5, b''+chr(a*9)+chr(b*9)+chr(c*9)+chr(d*9))

def Show(img):
    hub.display.show(img)

def Show3x3(s):
    hub.display.show(
        hub.Image('00000:0'+s[0:3]+'0:0'+s[3:6]+'0:0'+s[6:9]+'0:00000')
    )

def ScanDisp(p):
    Show3x3(('900000000', '009000000', '000000009', '000000900',
             '090000000', '000009000', '000000090', '000900000',
             '000090000')[p])

def ScanRGB(f, o):
    rgb = sensor_color.get()
    c.set_rgb(f, o, rgb)
    rgb = ((2,0,0),
        (2,0,0),
        (2,1,0),
        (2,2,0),
        (0,2,0),
        (0,2,0),
        (0,0,2),
        (0,0,2),
        (2,2,2))[c.get_clr(f, o)]
    hub.led(rgb[0]*125, rgb[1]*20, rgb[2]*20)

def ScanFace(f, o, tilt = 1, back = False):
    global slower, scan_speed
    global motor_turn_base
    dir = scan_mid
    mid = True
    if f > 0:
        run_nw(motor_scan, motor_scan_base+scan_awy, scan_pwr)
        TiltTilt(tilt, True)
        dir -= scan_awy
        mid = False
    scanning = True
    while scanning:
        # print("FACE "+str(f))
        slower = 0
        if mid:
            run_nw(motor_scan, motor_scan_base+scan_mid, scan_pwr)
        TiltAway()
        ScanDisp(8)
        if dir > 0:
            run_wt_up(motor_scan, motor_scan_base+scan_mid-3)
        else:
            run_wt_dn(motor_scan, motor_scan_base+scan_mid+3)
        ScanRGB(f, 8)
        if back:
            motor_turn_base -= turn_90
            run_nw(motor_turn, motor_turn_base+turn_45, scan_speed)
        else:
            run_nw(motor_turn, motor_turn_base+turn_90*4, scan_speed)
        for i in range(4):
            ScanPiece(scan_crn, motor_turn_base+turn_45, f, o, i, back)
            if back:
                back = False
                run_nw(motor_turn, motor_turn_base+turn_90*4, scan_speed)
            motor_turn_base += turn_90
            ScanPiece(scan_edg, motor_turn_base, f, o+1, i+4)
            o += 2
            if o > 7:
                o = 0
        if slower > 4:
            dir = scan_mid-scan_edg
            mid = True
            scan_speed -= 1
            print("Scan speed "+str(slower)+" "+str(scan_speed))
        scanning = False
    hub.display.clear()

tiltd = 0

def SolveCube():
    global tiltd
    CubeInsert()
    scan = 0
    found = False
    while not found and scan < 3:
        ColorOn()
        ms = time.ticks_ms()
        scan += 1
        tiltd += 1
        ScanFace(0, 2)
        ScanFace(4, 4, 0)
        ScanFace(2, 4, 0, True)
        ScanFace(3, 2, 0, True)
        ScanFace(5, 6)
        ScanFace(1, 6)
        ColorOff()
        hub.led(0, 0, 0)
        Show3x3('968776897')
        run_nw(motor_scan, motor_scan_base, scan_pwr)
        TiltHold()
        Show(FACE_LEFT)
        sms = int((time.ticks_ms()-ms)/100)
        print("SCAN: "+str(int(sms/10))+"."+str(sms%10)+"s")
        t = -1
        for i in range(12):
            # print("TYPE "+str(i))
            valid = c.determine_colors(i)
            # c.display()
            if valid:
                t = i
                # print("Valid: "+str(t))
                valid = c.valid_positions()
                if valid:
                    found = True
                    break
        if not found and scan == 3 and t >= 0:
            found = c.determine_colors(t)
            # c.display()
            # print("Invalid? "+str(t))
    # }
    if found:
        # print("Solving...")
        Show(FACE_RIGHT)
        c.solve(2000)
        # c.solve_apply()
        # c.display()
        Show(FACE)
        # Cube orientation after scan
        d = 3
        f = 0
        for mv in range(c.mv_n):
            md = c.mv_f[mv]
            mr = c.mv_r[mv]
            # print("Move ["+str(md)+" "+str(mr)+"]")
            # print("["+str(d)+" "+str(f)+"]")
            while d != md:
                rm = cm.get_remap(d, f)
                if md == rm.fm[1] or md == rm.fm[3]:
                    Show(FACE_BLNK0)
                    TiltAway()
                    Show(FACE_BLNK1)
                    if (md == rm.fm[1]) != (tiltd > 0):
                        TurnRotate(1)
                        f = rm.fm[4]
                    else:
                        TurnRotate(-1)
                        f = rm.fm[5]
                    Show(FACE_BLNK0)
                elif md == rm.fm[4] or (md == rm.fm[2] and tiltd > 0):
                    if mv % 4 == 0:
                        Show(FACE_LEFT)
                    TiltTilt(0)
                    tiltd -= 1
                    d = rm.fm[4]
                    # print("tiltd = "+str(tiltd))
                else: # md == rm.fm[5]
                    if mv % 4 == 2:
                        Show(FACE_RIGHT)
                    TiltTilt(1)
                    tiltd += 1
                    d = rm.fm[5]
                    # print("tiltd = "+str(tiltd))
                if d != md:
                    # Wait to ensure double tilt is reliable
                    time.sleep_ms(150)
            # }
            # print("["+str(d)+" "+str(f)+"]")
            mrn = 0
            mvn = mv+1
            while mvn < c.mv_n:
                if cm.adjacent(c.mv_f[mvn], md):
                    mrn = c.mv_r[mvn]
                    break
                mvn += 1
            # }
            Show(FACE)
            TurnTurn(mr, mrn)
        # }
        ms = int((time.ticks_ms()-ms)/100)
        print("SOLVED: "+str(c.mv_n)+" turns "+str(int(ms/10))+"."+str(ms%10)+"s")
        TiltAway()
        time.sleep_ms(500)
        if c.mv_n > 0:
            TurnRotate(-6)
    # }
    else:
        run_nw(motor_scan, motor_scan_base, scan_pwr)
        TiltAway()
    while (motor_scan.busy(1) or
           motor_turn.busy(1) or
           motor_tilt[0].busy(1) or
           motor_tilt[1].busy(1)):
        time.sleep_ms(1)
    motor_scan.brake()
    motor_turn.brake()
    motor_tilt[0].brake()
    motor_tilt[1].brake()
    CubeRemove()

#-----------------------------------------------------------------------------

def main():
    trace("main()")
    Init()
    while True:
        SolveCube()

trace("loaded")

#-----------------------------------------------------------------------------

main()

# END
