{
  stdenv,
  fetchFromGitHub,
  ...
}:

stdenv.mkDerivation (finalAttrs: {
  pname = "blowfish";
  version = "3.6.0";

  src = fetchFromGitHub {
    owner = "nunocoracao";
    repo = "blowfish";
    tag = "v${finalAttrs.version}";
    hash = "sha256-n2HPKTrUNcCgG27OYr1KkvS6NaEk+KSey8ykdB92V/Y=";
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
