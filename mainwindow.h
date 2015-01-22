#ifndef MAINWINDOW_H
#define MAINWINDOW_H


#include <QMainWindow>
#include <QtWebKitWidgets/QWebView>
#include <QUrl>
#include <QSystemTrayIcon>
#include <QTimer>
#include <QGridLayout>

class MainWindow : public QMainWindow
{
    Q_OBJECT
private:
    QGridLayout *layout;
    QWebView *webview;
    QSystemTrayIcon *m_Pop;
public:
    MainWindow(QWidget *parent = 0);
    ~MainWindow();
    int getSecFromString(QString timeStr);
public slots:
    void showText(QString text, int distendSec = 0);
    void showLastText();
    void showLater();
    void showMainWindow();
    void hideMainWindow();
    void regJavaScriptObject();

    void addAlert(QString title, int distendSeconds);
    QString getFileContent(QString fileName);
    void setFileContent(QString fileName,QString fileContent);

    void setIconNumber(int number);
private:
    QTimer *messageTimer;
    QString m_lastText;

};

#endif // MAINWINDOW_H
