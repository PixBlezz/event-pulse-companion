import logoAsset from "@/assets/compssa-logo.png.asset.json";

const Logo = ({ size = 40 }: { size?: number }) => (
  <img
    src={logoAsset.url}
    alt="COMPSSA logo"
    width={size}
    height={size}
    className="rounded-full object-cover shrink-0"
    style={{ width: size, height: size }}
  />
);

export default Logo;
