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

      dev-env = pkgs.buildEnv {
          name = "hugo-dev-${pkgs.hugo.version}";

          paths = [
            hugo-server
            pkgs.hugo
            pkgs.pandoc
          ];
        };
    in {
      # nix shell
      packages = {
        default = dev-env;
      };

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
