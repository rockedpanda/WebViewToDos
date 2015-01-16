#include "mainwindow.h"
#include <QDebug>
#include <QWebFrame>
#include <QFile>
#include <QDir>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
{
    /** 跨域相关的配置 **/
    QWebSettings::globalSettings()->setAttribute(QWebSettings::XSSAuditingEnabled, true);
    QWebSettings::globalSettings()->setAttribute(QWebSettings::DeveloperExtrasEnabled, true);
    QWebSettings::globalSettings()->setAttribute(QWebSettings::LocalContentCanAccessRemoteUrls, true);
    /** 插件和flash播放相关 */
    QWebSettings::globalSettings()->setAttribute(QWebSettings::JavascriptEnabled, true);
    QWebSettings::globalSettings()->setAttribute(QWebSettings::PluginsEnabled, true);

    webview = new QWebView(this);
    this->setGeometry(50,50,800,600);
    webview->setGeometry(0,0,800,600);

    connect(webview->page()->mainFrame(),SIGNAL(javaScriptWindowObjectCleared()), this, SLOT(regJavaScriptObject()));
    //this->setGeometry(this->x(),this->y(),800,600);
    webview->load(QUrl("file:///"+QDir::currentPath()+"/index.html"));
    webview->show();


    messageTimer = new QTimer();
    this->setWindowTitle(QStringLiteral("任务提醒"));

    messageTimer->setSingleShot(true);
    connect(messageTimer,SIGNAL(timeout()),this,SLOT(showLastText()));
    m_Pop = new QSystemTrayIcon(this);
    m_Pop->setIcon(QIcon(QDir::currentPath()+"/images/0.png"));
    m_Pop->show();

    connect(m_Pop,SIGNAL(messageClicked()),this,SLOT(showMainWindow()));
    //connect(m_Pop,SIGNAL(destroyed()),this,SLOT(showLater()));
    connect(m_Pop,SIGNAL(activated(QSystemTrayIcon::ActivationReason)),this,SLOT(showMainWindow()));

    //addAlert("monnnnnnnnnn sasdfa",60);
}

MainWindow::~MainWindow()
{
    delete webview;
    webview = NULL;
}
int MainWindow::getSecFromString(QString timeStr)
{
    return 5;
}

void MainWindow::showText(QString text, int distendSec)
{
    qDebug() << "show text";
    m_lastText = text;
    if(distendSec != 0){
        int timeDistence = distendSec;
        //messageTimer->setInterval(timeDistence);
        messageTimer->setSingleShot(true);
        messageTimer->start(timeDistence * 1000);
        return;
    }
    m_Pop->setToolTip(text); //"Money money go my home."
    m_Pop->setIcon(QIcon(QDir::currentPath()+"/images/0.png"));
    m_Pop->setVisible(true);
    m_Pop->show();

    m_Pop->showMessage(QStringLiteral("任务提醒"),text,QSystemTrayIcon::Information,60000);

}

void MainWindow::showLastText()
{
    qDebug() << "showlasttext";
    showText(m_lastText);
}

void MainWindow::showLater()
{
    qDebug() << "show later";
    messageTimer->start(30 * 1000); //300秒以后再出现
}

void MainWindow::showMainWindow()
{
    this->show();
}

void MainWindow::hideMainWindow()
{
    this->hide();
}

void MainWindow::addAlert(QString title, int distendSeconds)
{
    this->showText(title, distendSeconds);
}

QString MainWindow::getFileContent(QString fileName)
{
    QString content;
    QFile file(QDir::currentPath()+"/"+fileName);
    bool openOK = file.open(QIODevice::ReadOnly);
    if(openOK)
    {
        content = file.readAll();
        file.close();
    }
    else
    {
         //R_ERROR("Open file: " + fileName + " failed.");
    }
    return content;
}

void MainWindow::setFileContent(QString fileName, QString fileContent)
{
    QString content;
    QFile file(QDir::currentPath()+"/"+fileName);
    bool openOK = file.open(QIODevice::WriteOnly);
    if(openOK)
    {
        content = file.write(fileContent.toUtf8());
        file.close();
    }
    else
    {
         //R_ERROR("Open file: " + fileName + " failed.");
    }
}


void MainWindow::regJavaScriptObject()
{
    QWebFrame *frame = webview->page()->mainFrame();
    frame->addToJavaScriptWindowObject("win",this);
    //frame->addToJavaScriptWindowObject("console",Console::GetInstance());
}
