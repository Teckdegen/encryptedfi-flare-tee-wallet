"use client";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { VAULT, VAULT_ABI, ERC20_ABI, Token } from "../lib/contracts";
import { parseUnits, keccak256, toHex, encodeAbiParameters } from "viem";
import { SwapCard } from "./SwapCard";

function randomBytes32(): `0x${string}` {
  const a = new Uint8Array(32);
  crypto.getRandomValues(a);
  return `0x${Array.from(a).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

export function Shield() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { data: allowance } = useReadContract({
    address: undefined,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, VAULT] : undefined,
    query: { enabled: false },
  });

  async function onSubmit(from: Token, _to: Token, amount: string) {
    try {
      const wei = parseUnits(amount, from.decimals);
      const a = allowance as bigint | undefined;
      if (!a || a < wei) {
        await writeContractAsync({
          address: from.address as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [VAULT, wei],
        });
      }
      const salt = randomBytes32();
      const noteId = keccak256(encodeAbiParameters(
        [{ type: "bytes32" }, { type: "uint256" }, { type: "address" }],
        [salt, wei, from.address as `0x${string}`],
      ));
      const placeholderEnc = toHex(new Uint8Array(221));
      await writeContractAsync({
        address: VAULT,
        abi: VAULT_ABI,
        functionName: "deposit",
        args: [from.address as `0x${string}`, wei, noteId, placeholderEnc, salt],
      });
    } catch {}
  }

  return (
    <SwapCard
      title="Shield"
      mode="shield"
      submitLabel="Shield"
      onSubmit={onSubmit}
      hint="Turn a token into its encrypted note. 0.5% fee."
    />
  );
}
