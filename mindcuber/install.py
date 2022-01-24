#-----------------------------------------------------------------------------
# Title:        MindCuber-RI Installer
#
# Author:       David Gilday
#
# Copyright:    (C) 2021 David Gilday
#
# Website:      http://mindcuber.com
#
# Version:      v1p0
#
# Modified:     $Date: 2021-02-28 15:57:52 +0000 (Sun, 28 Feb 2021) $
#
# Revision:     $Revision: 7865 $
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
# Purpose:    MindCuber-RI-v1p0 software installer
#-----------------------------------------------------------------------------
#
# Note:
#   This program must be run once to install modules and data files
#   that will allow the main program, MindCuber-RI-v1p0, to run
#
#-----------------------------------------------------------------------------

from spike import LightMatrix, Speaker
lm = LightMatrix()
lm.show_image('SQUARE')
sp = Speaker()
sp.beep(72)

import os, umachine, ubinascii

version = "v1p0"

# Remove any files from older versions
for fn in os.listdir("/"):
    if len(fn) > 10:
        ver = None
        if fn[-3:] == ".py" and (
            fn[:-7] == "mcricolors_" or
            fn[:-7] == "mcrimaps_" or
            fn[:-7] == "mcrisolver_" or
            fn[:-7] == "mindcuberri_"
            ):
            ver = fn[-7:-3]
        elif fn[-4:] == ".bin" and (
            fn[:-8] == "mcrimtab1_" or
            fn[:-8] == "mcrimtab4_"
            ):
            ver = fn[-8:-4]
        if ver != None and ver < version:
            print("DELETING: "+fn)
            os.unlink(fn)

def file_exists(fn):
    try:
        ok = os.stat(fn) != None
    except:
        ok = False
    return ok

# Install MindCuber-RI v1p0 files
prj = "/projects/"
found = 0
with open(prj+".slots","r") as f:
    slots = eval(f.read())
for s in slots:
    base = prj+str(slots[s]['id'])
    # Filename used by latest hub OS
    fn = base+"/__init__.py"
    if not file_exists(fn):
        # Try filename used by older versions of hub OS
        fn = base+".py"
    if file_exists(fn):
        with open(fn) as f:
            for i in range(3):
                l = f.readline()
                if l == "#MINDCUBERRI_FILES_V1P0#\n":
                    print("SLOT: "+str(s)+" "+fn+" "+str(os.stat(fn)[6])+"B")
                    print("Installing...")
                    found += 1
                    of = None
                    b64 = False
                    n = 0
                    for l in f:
                        if l[:5] == "#FILE":
                            ofn = l[5:-1]
                            b64 = ofn[-4:] == ".bin"
                            sp.beep(67)
                            of = open(ofn, 'wb')
                        elif l[:8] == "#ENDFILE":
                            of.close()
                            of = None
                            print("SAVED: "+ofn+" "+str(os.stat(ofn)[6])+"B")
                        elif of != None:
                            if b64:
                                if l[0:5] != "#====":
                                    of.write(ubinascii.a2b_base64(l[1:-1]))
                            else:
                                of.write(l)
                            n += 1
                            if n % 50 == 0:
                                lm.show_image('CLOCK'+str(1+(int(n/50)%12)))
                    if of != None:
                        # Missing end of file
                        of.close()
                        print("ERROR: end file marker expected")
                        print("DELETING: "+ofn)
                        ofn.unlink()
os.sync()
if found > 0:
    sp.beep(72)
    msg = "MindCuber-RI v1p0 files installed"
    print("FINISHED "+msg)
    lm.write(msg)
    umachine.reset()
else:
    msg = "ERROR: no files found to install"
    print(msg)
    lm.write(msg)

raise SystemExit

# END
