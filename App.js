import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

const idadeCalculada = (dataNascimentoDetalhada, anoAtual, mesAtual, diaAtual) => {
  let anos = anoAtual - dataNascimentoDetalhada.ano;
  let meses, dias;

  if (mesAtual < dataNascimentoDetalhada.mes) {
    anos--;
    meses = 12 - (dataNascimentoDetalhada.mes - mesAtual);
  } else {
    meses = mesAtual - dataNascimentoDetalhada.mes;
  }

  if (diaAtual < dataNascimentoDetalhada.dia) {
    meses--;
    const mesAnterior = mesAtual === 1 ? 12 : mesAtual - 1;
    const diasNoMesAnterior = obterDiasNoMes(mesAnterior, anoAtual);
    dias = diasNoMesAnterior - (dataNascimentoDetalhada.dia - diaAtual);
  } else {
    dias = diaAtual - dataNascimentoDetalhada.dia;
  }
  return { anos, meses, dias };
}

const obterDiasNoMes = (mes, ano) => {
  const anoBissexto = (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
  const diasNoMes = [31, anoBissexto ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return diasNoMes[mes - 1];
}

const mostrarIdade = (anos, meses, dias) => {
  let idadeString = '';
  if (anos > 0) {
    idadeString += `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
  }
  if (meses > 0) {
    if (idadeString) idadeString += ', ';
    idadeString += `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  }
  if (dias > 0) {
    if (idadeString) idadeString += ', ';
    idadeString += `${dias} ${dias === 1 ? 'dia' : 'dias'}`;
  }
  if (!idadeString) {
    idadeString = '0 dias';
  }
  return idadeString;
}

const formatarData = (data) => {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

const parseDataPtBr = (texto) => {
  // Espera DD/MM/AAAA
  const partes = texto.split('/');
  if (partes.length !== 3) return null;
  const [dia, mes, ano] = partes.map(Number);
  if (!dia || !mes || !ano) return null;
  // Validação simples de data
  if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 1900) return null;
  return new Date(ano, mes - 1, dia);
};

export default function App() {
  const [dataTexto, setDataTexto] = useState('');
  const [dataDigitada, setDataDigitada] = useState(null);
  const [idade, setIdade] = useState('');

  const calculaIdade = () => {
    const dataNascimento = parseDataPtBr(dataTexto);
    if (!dataNascimento) {
      setIdade('Data inválida!');
      return;
    }
    setDataDigitada(dataNascimento);
    const dataAtual = new Date();
    const dataNascimentoDetalhada = {
      dia: dataNascimento.getDate(),
      mes: dataNascimento.getMonth() + 1,
      ano: dataNascimento.getFullYear()
    };
    const anoAtual = dataAtual.getFullYear();
    const mesAtual = dataAtual.getMonth() + 1;
    const diaAtual = dataAtual.getDate();

    const { anos, meses, dias } = idadeCalculada(
      dataNascimentoDetalhada,
      anoAtual,
      mesAtual,
      diaAtual
    );

    setIdade(mostrarIdade(anos, meses, dias));
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Cálculo de idade</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Data de nascimento</Text>
        <TextInput
          style={styles.inputData}
          placeholder="DD/MM/AAAA"
          value={dataTexto}
          onChangeText={setDataTexto}
          keyboardType="numeric"
          maxLength={10}
        />
        <TouchableOpacity style={styles.botao} onPress={calculaIdade}>
          <Text style={styles.textoBotao}>Calcular idade</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.resultadoCard}>
        <Text style={styles.resultadoTitulo}>Idade calculada</Text>
        <Text style={styles.resultadoTexto}>{idade}</Text>
        {dataDigitada && (
          <Text style={styles.dataInfo}>
            Data informada: {formatarData(dataDigitada)}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fc',
    alignItems: 'center',
    paddingTop: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2a4d69',
    marginBottom: 30,
    letterSpacing: 1,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 16,
    color: '#2a4d69',
    marginBottom: 8,
    fontWeight: '600',
  },
  inputData: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#b0bec5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f7fafc',
    marginBottom: 18,
    alignItems: 'center',
    fontSize: 18,
    color: '#2a4d69',
    letterSpacing: 1,
    textAlign: 'center',
  },
  botao: {
    backgroundColor: '#4f8cff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  resultadoCard: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  resultadoTitulo: {
    fontSize: 18,
    color: '#4f8cff',
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 1,
  },
  resultadoTexto: {
    fontSize: 24,
    color: '#2a4d69',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  dataInfo: {
    marginTop: 10,
    fontSize: 14,
    color: '#2a4d69',
    textAlign: 'center',
  },
});
