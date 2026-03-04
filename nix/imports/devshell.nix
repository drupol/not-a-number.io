{ inputs, ... }:
{
  imports = [ inputs.make-shell.flakeModules.default ];

  perSystem =
    {
      pkgs,
      ...
    }:
    {
      make-shells.default = {
        packages =
          with pkgs;
          let
            hugo-server = pkgs.writeScriptBin "hugo-server" ''
              ${lib.getExe pkgs.hugo} server --buildDrafts --enableGitInfo --forceSyncStatic -F
            '';
          in
          [
            hugo-server
            pkgs.hugo
            pkgs.pandoc
            (pkgs.aspellWithDicts (d: [
              d.fr
              d.en
              d.en-computers
            ]))
          ];
      };
    };
}
