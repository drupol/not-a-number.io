{
  description = "Hugo website ";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";
  };

  outputs = inputs @ { self, flake-parts, ... }: flake-parts.lib.mkFlake { inherit inputs; } {
    systems = import inputs.systems;

    perSystem = { config, self', inputs', pkgs, system, lib, ... }:
      let
        hugo-server = pkgs.writeScriptBin "hugo-server" ''
          ${lib.getExe pkgs.hugo} server --enableGitInfo --forceSyncStatic -F
        '';
      in
      {
        # nix develop
        devShells = {
          default = pkgs.stdenvNoCC.mkDerivation {
            name = "hugo-devshell";
            buildInputs = [
              hugo-server
              pkgs.hugo
              pkgs.pandoc
              (pkgs.aspellWithDicts (d: [ d.fr d.en d.en-science d.en-computers ]))
            ];
          };
        };

        # nix run
        apps = {
          default = {
            type = "app";
            program = lib.getExe hugo-server;
          };
        };

      };
  };
}
