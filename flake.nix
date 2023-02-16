{
  description = "Hugo dev";

  inputs = {
    nixpkgs.url = github:NixOS/nixpkgs/nixpkgs-unstable;
    flake-utils.url = github:numtide/flake-utils;
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs {
        inherit system;
      };

      hugo-server = pkgs.writeScriptBin "hugo-server" ''
        ${pkgs.hugo}/bin/hugo server --enableGitInfo --forceSyncStatic -F
      '';
    in {
      # nix develop
      devShells = {
        default = pkgs.stdenvNoCC.mkDerivation {
          name = "hugo-devshell";
          buildInputs = [
            hugo-server
            pkgs.hugo
            pkgs.pandoc
          ];
        };
      };

      # nix run
      apps = {
        default = {
          type = "app";
          program = "${hugo-server}/bin/hugo-server";
        };
      };

    });
}
