{
  lib,
  fetchFromGitHub,
  php82,
}:

php82.buildComposerProject2 (_finalAttrs: {
  pname = "oss-contribs";
  version = "0.2";

  src = fetchFromGitHub {
    owner = "staabm";
    repo = "oss-contribs";
    rev = "8cce2fe50a1474b1004712adea803bacb502f5e5";
    hash = "sha256-/rOtACuWRNi8mKcTns7bCaI9XF7GrlX8Ivg6AbcV2V0=";
  };

  # TODO: patch upstream
  postPatch = ''
    chmod +x bin/*
  '';

  # TODO: patch upstream
  composerStrictValidation = false;

  vendorHash = "sha256-GZ4rBewtNN4Y340dus+sCjjIikrEMxI/50FB+mi2tBk=";

  meta = {
    license = lib.licenses.mit;
    mainProgram = "oss-contribs";
  };
})
