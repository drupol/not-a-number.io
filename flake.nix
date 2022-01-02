{
  description = "Hugo dev";
  inputs = {
    nixpkgs.url = github:NixOS/nixpkgs/nixos-unstable;
    flake-utils.url = github:numtide/flake-utils;
  };
  outputs = { self, nixpkgs, flake-utils }:
    with flake-utils.lib; eachSystem allSystems (system:
    let
      pkgs = nixpkgs.legacyPackages.${system};
    in rec {
      packages = {
        hugo = pkgs.stdenvNoCC.mkDerivation rec {
          name = "hugo-dev-${pkgs.hugo.version}";
          buildInputs = [ pkgs.hugo ];
        };
      };
      defaultPackage = packages.hugo;
    });
}
