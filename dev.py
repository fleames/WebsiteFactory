#!/usr/bin/env python3
"""Kill any process on port 3001 and restart the builder."""

import subprocess
import sys
import os
import time

PORT = 3001
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))


def kill_port(port: int) -> None:
    try:
        result = subprocess.run(
            ["netstat", "-ano"],
            capture_output=True, text=True
        )
        pids = set()
        for line in result.stdout.splitlines():
            if f":{port}" in line and ("LISTENING" in line or "ESTABLISHED" in line):
                parts = line.split()
                if parts:
                    pids.add(parts[-1])

        for pid in pids:
            if pid.isdigit():
                subprocess.run(
                    ["taskkill", "/PID", pid, "/F"],
                    capture_output=True
                )
                print(f"  Killed PID {pid} (was on port {port})")

        if pids:
            time.sleep(0.5)
        else:
            print(f"  No process found on port {port}")
    except Exception as e:
        print(f"  Warning: could not kill port {port}: {e}")


def main():
    print(f"\n{'━'*45}")
    print("  Website Factory — Dev Launcher")
    print(f"{'━'*45}")

    print(f"\n⟳  Killing old builder on port {PORT}...")
    kill_port(PORT)

    print("⟳  Starting builder...\n")

    # Use npm run builder via cmd so tsx resolves correctly on Windows
    proc = subprocess.Popen(
        ["cmd", "/c", "npm run builder"],
        cwd=PROJECT_DIR,
    )

    try:
        proc.wait()
    except KeyboardInterrupt:
        print("\n\n  Stopped.")
        proc.terminate()
        sys.exit(0)


if __name__ == "__main__":
    main()
