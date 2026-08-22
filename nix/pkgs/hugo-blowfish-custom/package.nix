{
  stdenv,
  fetchFromGitHub,
  ...
}:

stdenv.mkDerivation (_finalAttrs: {
  pname = "blowfish";
  version = "3.4.0-unstable-2026-08-22";

  src = fetchFromGitHub {
    owner = "nunocoracao";
    repo = "blowfish";
    rev = "69014f6547c918d04ca7bab2b40eb750f86c66b2";
    hash = "sha256-PcHhtBEFCEpl4kjPt5XRb1wdRCtsqAau89dBPiCPSfE=";
  };

  patches = [
    ./patches/blowfish-customisations.patch
  ];

  installPhase = ''
    runHook preInstall

    mkdir -p $out
    cp -ar . $out/

    runHook postInstall
  '';
})
