{ inputs, ... }:
{
  flake-file.inputs = {
    make-shell.url = "github:nicknovitski/make-shell";
  };

  imports = [ inputs.make-shell.flakeModules.default ];

  perSystem =
    {
      pkgs,
      config,
      ...
    }:
    {
      make-shells.default = {
        packages = with pkgs; [
          config.packages.oss-contribs
          gnuplot
          just
          hugo
          lychee
          pandoc
          mcp-server-fetch
          mcp-server-filesystem
          mcp-server-git
          mcp-server-memory
          mcp-server-sequential-thinking
          mcp-server-time
          github-mcp-server
          (aspellWithDicts (d: [
            d.fr
            d.en
            d.en-computers
          ]))
        ];

        shellHook = ''
          mkdir -p themes
          if [ ! -e themes/blowfish ]; then
            echo "Creating symlink for themes/blowfish..."
            ln -snf "${config.packages.hugo-blowfish-custom}" themes/blowfish
          else
            echo "themes/blowfish already exists, skipping symlink creation."
          fi
        '';
      };
    };
}
