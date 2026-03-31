package de.igslandstuhl.database.results;

import de.igslandstuhl.database.plugins.Plugin;

public class ResultsPlugin extends Plugin {
    private ResultsPluginConfig config;

    @Override
    protected void onLoad() {
        config = new ResultsPluginConfig(this);
        System.out.println("Loaded Results plugin!");
    }

    @Override
    protected void onEnable() {
        System.out.println("Results plugin is now enabled");
    }

    @Override
    protected void onDisable() {}

    @Override
    public ResultsPluginConfig getConfig() {
        return config;
    }
}