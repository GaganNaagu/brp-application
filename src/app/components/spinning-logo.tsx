import Image from "next/image";

export default function SpinningLogo() {
  return (
    <div className="flex justify-center mb-8">
      <div className="">
      {/* <div className="animate-spin-slow"> */}
        <Image
          src="https://r2.fivemanage.com/BR7Q2n0nR3UkMtqZisSkc/brp-logo.png"
          alt="FiveM Server Logo"
          width={100}
          height={100}
        />
      </div>
    </div>
  );
}
