package de.igslandstuhl.database.results;

import de.igslandstuhl.database.plugins.config.BoolSetting;
import de.igslandstuhl.database.plugins.config.PluginConfig;
import de.igslandstuhl.database.plugins.config.PluginSetting;

public class ResultsPluginConfig extends PluginConfig<ResultsPlugin> {
    private final BoolSetting showPrognosis;
    private final BoolSetting showCurrentProgress;
    private final BoolSetting showCurrentGrade;

    private ResultsPluginConfig(ResultsPlugin plugin, BoolSetting showPrognosis, BoolSetting showCurrentProgress, BoolSetting showCurrentGrade) {
        super(plugin, new PluginSetting[] {showPrognosis,showCurrentProgress,showCurrentGrade});
        this.showPrognosis = showPrognosis;
        this.showCurrentGrade = showCurrentGrade;
        this.showCurrentProgress = showCurrentProgress;
    }
    ResultsPluginConfig(ResultsPlugin plugin) {
        this(plugin,
            new BoolSetting("show_prognosis", "Show Prognosis", "Whether to display the prognosis for the final result", true),
            new BoolSetting("show_current_progress", "Show Current", "Whether to display the current progress to the subject (in percent)", true),
            new BoolSetting("show_current_grade", "Show Currently Achieved Grade", "Whether to display the grade the student would achieve when they decide to immediately stop working", false)
        );
    }
    public boolean showPrognosis() {
        return showPrognosis.isEnabled();
    }
    public boolean showCurrentProgress() {
        return showCurrentProgress.isEnabled();
    }
    public boolean showCurrentGrade() {
        return showCurrentGrade.isEnabled();
    }
}
