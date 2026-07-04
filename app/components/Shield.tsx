"use client";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { TOKENS, VAULT, VAULT_ABI, ERC20_ABI } from "../lib/contracts";
import { parseUnits, keccak256, toHex, encodeAbiParameters, formatUnits } from "viem";
import { useState } from "react";
import { Shield as ShieldIcon, ArrowDown } from "lucide-react";

function randomBytes32(): `0x${string}` {
  const a = new Uint8Array(32);
  crypto.getRandomValues(a);
  return `0x${Array.from(a).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

export function Shield() {
  const { address } = useAccount();
  const [mode, setMode] = useState<"shield" | "unshield">("shield");
  const [token, setToken] = useState(TOKENS[0]);
  const [amount, setAmount] = useState("");
  const { writeContractAsync, isPending } = useWriteContract();
  const [step, setStep] = useState<"idle" | "approving" | "shielding" | "done" | "err">("idle");
  const [msg, setMsg] = useState<string>("");

  const { data: balance } = useReadContract({
    address: token.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 3000 },
  });

  const { data: allowance } = useReadContract({
    address: token.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, VAULT] : undefined,
    query: { enabled: !!address, refetchInterval: 3000 },
  });

  async function handleShield() {
    if (mode === "unshield") return;
    setMsg("");
    setStep("idle");
    try {
      const wei = parseUnits(amount, token.decimals);
      const a = allowance as bigint | undefined;
      if (!a || a < wei) {
        setStep("approving");
        await writeContractAsync({
          address: token.address as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [VAULT, wei],
        });
      }
      setStep("shielding");
      const salt = randomBytes32();
      const noteId = keccak256(encodeAbiParameters(
        [{ type: "bytes32" }, { type: "uint256" }, { type: "address" }],
        [salt, wei, token.address as `0x${string}`]
      ));
      const placeholderEnc = toHex(new Uint8Array(221));
      await writeContractAsync({
        address: VAULT,
        abi: VAULT_ABI,
        functionName: "deposit",
        args: [token.address as `0x${string}`, wei, noteId, placeholderEnc, salt],
      });
      setStep("done");
      setMsg(`Shielded ${amount} ${token.symbol}`);
      setAmount("");
    } catch (e) {
      setStep("err");
      setMsg((e as Error).message?.split("\n")[0] ?? "shield failed");
    }
  }

  const bal = balance as bigint | undefined;
  const balDisplay = bal !== undefined ? formatUnits(bal, token.decimals) : "...";

  return (
    <div className="space-y-4">
      <div className="glass rounded-full p-1 grid grid-cols-2">
        <button
          onClick={() => setMode("shield")}
          className={`py-2.5 text-xs font-bold tracking-widest rounded-full transition ${
            mode === "shield" ? "bg-white/10 text-ink" : "text-muted"
          }`}
        >
          SHIELD
        </button>
        <button
          onClick={() => setMode("unshield")}
          className={`py-2.5 text-xs font-bold tracking-widest rounded-full transition ${
            mode === "unshield" ? "bg-white/10 text-ink" : "text-muted"
          }`}
        >
          UNSHIELD
        </button>
      </div>

      <div className="glass rounded-3xl p-6">
        <div className="glass-strong rounded-2xl p-4 mb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted uppercase tracking-widest">
              From {mode === "shield" ? "wallet" : "encrypted"}
            </span>
            <span className="text-xs text-muted">
              {mode === "shield"
                ? `${Number(balDisplay).toLocaleString(undefined, { maximumFractionDigits: 4 })} ${token.symbol}`
                : "•••"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={token.symbol}
              onChange={(e) => setToken(TOKENS.find((t) => t.symbol === e.target.value)!)}
              className="bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-white/30"
            >
              {TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol} className="bg-bg">{t.symbol}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={mode === "unshield"}
              className="bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm flex-1 font-mono focus:outline-none focus:border-white/30 disabled:opacity-40"
            />
          </div>
        </div>

        <div className="flex justify-center py-1">
          <div className="glass w-10 h-10 rounded-full flex items-center justify-center">
            <ArrowDown size={16} className="text-muted" />
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-4 mb-4">
          <div className="text-xs text-muted uppercase tracking-widest mb-2">
            To {mode === "shield" ? "encrypted" : "wallet"}
          </div>
          <div className="text-sm font-mono">
            {amount ? `${(Number(amount) * 0.995).toFixed(4)} ${token.symbol}` : "0.00"}
            <span className="text-muted text-xs ml-2">(0.5% fee)</span>
          </div>
        </div>

        <button
          onClick={handleShield}
          disabled={mode === "unshield" || !amount || isPending}
          className="glass-btn w-full py-4 rounded-2xl text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2"
        >
          <ShieldIcon size={16} />
          {mode === "unshield"
            ? "Coming soon (TEE required)"
            : step === "approving"
            ? "Approving..."
            : step === "shielding"
            ? "Shielding..."
            : "Shield"}
        </button>

        {msg && (
          <div className={`mt-4 text-xs font-mono break-all ${step === "err" ? "text-danger" : "text-success"}`}>
            {msg}
          </div>
        )}
      </div>

      <div className="glass rounded-3xl p-5 text-xs text-muted leading-relaxed">
        {mode === "shield"
          ? "Real ECIES note encryption activates when the FCC TEE finishes registering."
          : "Unshielding requires the TEE relayer to sign the burn instruction. Activates when FCC registration completes."}
      </div>
    </div>
  );
}
